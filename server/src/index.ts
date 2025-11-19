import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Mock hotel data with prices for different dates
const mockHotels = [
  {
    id: 'disney-animal-kingdom',
    name: 'Animal Kingdom Lodge',
    park: 'disney' as const,
    tier: 'deluxe' as const,
    prices: generatePrices('2024-01-15', 180, 320),
  },
  {
    id: 'disney-art-animation',
    name: 'Art of Animation Resort',
    park: 'disney' as const,
    tier: 'value' as const,
    prices: generatePrices('2024-01-15', 120, 220),
  },
  {
    id: 'disney-poly',
    name: 'Polynesian Village Resort',
    park: 'disney' as const,
    tier: 'deluxe' as const,
    prices: generatePrices('2024-01-15', 250, 450),
  },
  {
    id: 'disney-caribbean-beach',
    name: 'Caribbean Beach Resort',
    park: 'disney' as const,
    tier: 'moderate' as const,
    prices: generatePrices('2024-01-15', 150, 280),
  },
  {
    id: 'universal-portofino',
    name: 'Loews Portofino Bay Hotel',
    park: 'universal' as const,
    tier: 'deluxe' as const,
    prices: generatePrices('2024-01-15', 200, 350),
  },
  {
    id: 'universal-hard-rock',
    name: 'Hard Rock Hotel',
    park: 'universal' as const,
    tier: 'deluxe' as const,
    prices: generatePrices('2024-01-15', 190, 340),
  },
  {
    id: 'universal-royal-pacific',
    name: 'Loews Royal Pacific Resort',
    park: 'universal' as const,
    tier: 'deluxe' as const,
    prices: generatePrices('2024-01-15', 195, 345),
  },
  {
    id: 'universal-aventura',
    name: 'Universal\'s Aventura Hotel',
    park: 'universal' as const,
    tier: 'moderate' as const,
    prices: generatePrices('2024-01-15', 130, 240),
  },
]

// Helper function to generate price data for 30 days
function generatePrices(startDate: string, minPrice: number, maxPrice: number) {
  const prices = []
  const start = new Date(startDate)

  for (let i = 0; i < 30; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() + i)

    // Create more realistic pricing: lower on weekdays, higher on weekends
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0
    const basePrice = minPrice + Math.random() * (maxPrice - minPrice)
    const weekendMultiplier = isWeekend ? 1.15 : 0.9
    const price = Math.round(basePrice * weekendMultiplier)

    prices.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(minPrice, Math.min(maxPrice, price)),
      available: true,
    })
  }

  return prices
}

// API Routes
app.get('/api/hotels', (req: Request, Response) => {
  try {
    res.json(mockHotels)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotels' })
  }
})

app.get('/api/hotels/:id', (req: Request, res: Response) => {
  try {
    const hotel = mockHotels.find(h => h.id === req.params.id)
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' })
    }
    res.json(hotel)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotel' })
  }
})

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
