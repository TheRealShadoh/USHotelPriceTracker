import express, { Request, Response } from 'express'
import cors from 'cors'
import { getCachedHotels, getHotelById, refreshHotels, findCheapestConsecutiveDays } from './hotelService.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// API Routes

/**
 * GET /api/hotels
 * Returns all hotels with their pricing data
 */
app.get('/api/hotels', async (req: Request, res: Response) => {
  try {
    const hotels = await getCachedHotels()
    res.json(hotels)
  } catch (error) {
    console.error('Error fetching hotels:', error)
    res.status(500).json({ error: 'Failed to fetch hotels' })
  }
})

/**
 * GET /api/hotels/:id
 * Returns a specific hotel by ID
 */
app.get('/api/hotels/:id', async (req: Request, res: Response) => {
  try {
    const hotel = await getHotelById(req.params.id)
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' })
    }
    res.json(hotel)
  } catch (error) {
    console.error('Error fetching hotel:', error)
    res.status(500).json({ error: 'Failed to fetch hotel' })
  }
})

/**
 * POST /api/refresh
 * Manually refresh the hotel cache
 */
app.post('/api/refresh', async (req: Request, res: Response) => {
  try {
    const hotels = await refreshHotels()
    res.json({ message: 'Cache refreshed', count: hotels.length })
  } catch (error) {
    console.error('Error refreshing cache:', error)
    res.status(500).json({ error: 'Failed to refresh cache' })
  }
})

/**
 * GET /api/deals/consecutive-days
 * Find cheapest X consecutive days across all hotels
 * Query params:
 *   - days: number of consecutive days (required, 1-365)
 *   - park: 'disney' or 'universal' (optional)
 */
app.get('/api/deals/consecutive-days', async (req: Request, res: Response) => {
  try {
    const daysParam = req.query.days as string
    const parkFilter = req.query.park as 'disney' | 'universal' | undefined

    if (!daysParam) {
      return res.status(400).json({ error: 'Missing "days" parameter' })
    }

    const days = parseInt(daysParam, 10)
    if (isNaN(days) || days < 1 || days > 365) {
      return res.status(400).json({ error: 'Days must be a number between 1 and 365' })
    }

    const deals = await findCheapestConsecutiveDays(days, parkFilter)

    // Return top 20 deals
    res.json({
      searchParams: { days, park: parkFilter || 'all' },
      totalDeals: deals.length,
      topDeals: deals.slice(0, 20),
    })
  } catch (error) {
    console.error('Error finding consecutive days deals:', error)
    res.status(500).json({ error: 'Failed to find deals' })
  }
})

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`API available at http://localhost:${PORT}/api`)
})
