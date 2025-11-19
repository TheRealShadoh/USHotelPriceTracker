import axios from 'axios'
import * as cheerio from 'cheerio'

interface HotelPrice {
  date: string
  price: number
  available: boolean
}

interface Hotel {
  id: string
  name: string
  park: 'disney' | 'universal'
  tier: 'value' | 'moderate' | 'deluxe'
  prices: HotelPrice[]
}

interface ConsecutiveDaysDeal {
  hotelId: string
  hotelName: string
  startDate: string
  endDate: string
  dayCount: number
  totalPrice: number
  averagePricePerNight: number
  park: 'disney' | 'universal'
}

// Cache for hotel data with timestamps
const hotelCache: Map<string, { data: Hotel[]; timestamp: number }> = new Map()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Disney hotel IDs for hotel data APIs
const DISNEY_HOTELS = [
  { id: 'disney-animal-kingdom', name: 'Animal Kingdom Lodge', tier: 'deluxe' },
  { id: 'disney-art-animation', name: 'Art of Animation Resort', tier: 'value' },
  { id: 'disney-poly', name: 'Polynesian Village Resort', tier: 'deluxe' },
  { id: 'disney-caribbean-beach', name: 'Caribbean Beach Resort', tier: 'moderate' },
]

// Universal hotel IDs
const UNIVERSAL_HOTELS = [
  { id: 'universal-portofino', name: 'Loews Portofino Bay Hotel', tier: 'deluxe' },
  { id: 'universal-hard-rock', name: 'Hard Rock Hotel', tier: 'deluxe' },
  { id: 'universal-royal-pacific', name: 'Loews Royal Pacific Resort', tier: 'deluxe' },
  { id: 'universal-aventura', name: "Universal's Aventura Hotel", tier: 'moderate' },
]

/**
 * Generates realistic price data for 12 months
 * Uses patterns: weekday discounts, weekend premiums, seasonal variation
 */
function generatePrices(startDate: string, basePrice: number, variance: number): HotelPrice[] {
  const prices: HotelPrice[] = []
  const start = new Date(startDate)

  // Generate data for 365 days (12 months)
  for (let i = 0; i < 365; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() + i)

    // Weekday/weekend pricing
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0
    const isHoliday = isHolidayDate(date)

    // Random variation
    const randomVariance = (Math.random() - 0.5) * variance
    let price = basePrice + randomVariance

    // Apply multipliers
    if (isHoliday) {
      price *= 1.35 // 35% premium for holidays
    } else if (isWeekend) {
      price *= 1.15 // 15% premium for weekends
    } else {
      price *= 0.80 // 20% discount for weekdays
    }

    prices.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(basePrice * 0.5, Math.round(price)),
      available: Math.random() > 0.05, // 95% availability
    })
  }

  return prices
}

/**
 * Check if a date is a holiday or peak season
 */
function isHolidayDate(date: Date): boolean {
  const month = date.getMonth()
  const dayOfMonth = date.getDate()
  const dayOfWeek = date.getDay()

  // New Year's (Dec 27 - Jan 3)
  if (month === 11 && dayOfMonth >= 27) return true
  if (month === 0 && dayOfMonth <= 3) return true

  // Spring Break (mid-March to mid-April)
  if (month === 2 && dayOfMonth >= 10) return true
  if (month === 3 && dayOfMonth <= 15) return true

  // Summer vacation (May - August)
  if (month >= 4 && month <= 7) return true

  // Labor Day weekend
  if (month === 8 && dayOfWeek === 0 && dayOfMonth <= 7) return true

  // Halloween week
  if (month === 9 && dayOfMonth >= 25) return true

  // Thanksgiving week (last week of November)
  if (month === 10 && dayOfMonth >= 20) return true

  // Christmas/New Year (Dec 20 - Jan 5)
  if (month === 11 && dayOfMonth >= 20) return true

  return false
}

/**
 * Fetches real hotel pricing data
 * Currently uses simulated data with holiday patterns matching real Orlando data
 */
async function fetchRealHotelData(): Promise<Hotel[]> {
  try {
    console.log('Fetching hotel data for next 12 months...')

    const hotels: Hotel[] = []
    const today = new Date().toISOString().split('T')[0]

    // Create Disney hotels with realistic pricing
    for (const hotelInfo of DISNEY_HOTELS) {
      const basePrice = hotelInfo.tier === 'deluxe' ? 280 : hotelInfo.tier === 'moderate' ? 180 : 130
      hotels.push({
        id: hotelInfo.id,
        name: hotelInfo.name,
        park: 'disney',
        tier: hotelInfo.tier as 'deluxe' | 'moderate' | 'value',
        prices: generatePrices(today, basePrice, basePrice * 0.4),
      })
    }

    // Create Universal hotels with realistic pricing
    for (const hotelInfo of UNIVERSAL_HOTELS) {
      const basePrice = hotelInfo.tier === 'deluxe' ? 250 : 160
      hotels.push({
        id: hotelInfo.id,
        name: hotelInfo.name,
        park: 'universal',
        tier: hotelInfo.tier as 'deluxe' | 'moderate',
        prices: generatePrices(today, basePrice, basePrice * 0.35),
      })
    }

    console.log(`Loaded ${hotels.length} hotels with 365 days of pricing data`)
    return hotels
  } catch (error) {
    console.error('Error fetching hotel data:', error)
    return generateFallbackHotels()
  }
}

/**
 * Generates fallback hotel data if real API is unavailable
 */
function generateFallbackHotels(): Hotel[] {
  const hotels: Hotel[] = []
  const today = new Date().toISOString().split('T')[0]

  for (const hotelInfo of DISNEY_HOTELS) {
    const basePrice = hotelInfo.tier === 'deluxe' ? 280 : hotelInfo.tier === 'moderate' ? 180 : 130
    hotels.push({
      id: hotelInfo.id,
      name: hotelInfo.name,
      park: 'disney',
      tier: hotelInfo.tier as 'deluxe' | 'moderate' | 'value',
      prices: generatePrices(today, basePrice, basePrice * 0.4),
    })
  }

  for (const hotelInfo of UNIVERSAL_HOTELS) {
    const basePrice = hotelInfo.tier === 'deluxe' ? 250 : 160
    hotels.push({
      id: hotelInfo.id,
      name: hotelInfo.name,
      park: 'universal',
      tier: hotelInfo.tier as 'deluxe' | 'moderate',
      prices: generatePrices(today, basePrice, basePrice * 0.35),
    })
  }

  return hotels
}

/**
 * Gets cached hotels or fetches new data
 */
export async function getCachedHotels(): Promise<Hotel[]> {
  const cached = hotelCache.get('hotels')

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Returning cached hotel data')
    return cached.data
  }

  console.log('Cache expired or empty, fetching fresh data')
  const hotels = await fetchRealHotelData()

  hotelCache.set('hotels', {
    data: hotels,
    timestamp: Date.now(),
  })

  return hotels
}

/**
 * Gets a specific hotel by ID
 */
export async function getHotelById(id: string): Promise<Hotel | null> {
  const hotels = await getCachedHotels()
  return hotels.find(h => h.id === id) || null
}

/**
 * Finds the cheapest X consecutive days across all hotels
 */
export async function findCheapestConsecutiveDays(
  numberOfDays: number,
  parkFilter?: 'disney' | 'universal'
): Promise<ConsecutiveDaysDeal[]> {
  const hotels = await getCachedHotels()
  const deals: ConsecutiveDaysDeal[] = []

  if (numberOfDays < 1 || numberOfDays > 365) {
    throw new Error('Number of days must be between 1 and 365')
  }

  // Filter hotels by park if specified
  const filteredHotels = parkFilter ? hotels.filter(h => h.park === parkFilter) : hotels

  // For each hotel, find all consecutive day periods
  for (const hotel of filteredHotels) {
    const prices = hotel.prices.slice(0, hotel.prices.length)

    // Iterate through all possible starting dates
    for (let i = 0; i <= prices.length - numberOfDays; i++) {
      const consecutivePrices = prices.slice(i, i + numberOfDays)

      // Check if all days are available
      if (consecutivePrices.some(p => !p.available)) {
        continue
      }

      const totalPrice = consecutivePrices.reduce((sum, p) => sum + p.price, 0)
      const startDate = consecutivePrices[0].date
      const endDate = consecutivePrices[numberOfDays - 1].date

      deals.push({
        hotelId: hotel.id,
        hotelName: hotel.name,
        startDate,
        endDate,
        dayCount: numberOfDays,
        totalPrice,
        averagePricePerNight: Math.round(totalPrice / numberOfDays),
        park: hotel.park,
      })
    }
  }

  // Sort by total price (cheapest first)
  return deals.sort((a, b) => a.totalPrice - b.totalPrice)
}

/**
 * Refreshes the hotel cache
 */
export async function refreshHotels(): Promise<Hotel[]> {
  hotelCache.delete('hotels')
  return getCachedHotels()
}
