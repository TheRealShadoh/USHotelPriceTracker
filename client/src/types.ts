export interface HotelPrice {
  date: string
  price: number
  available: boolean
}

export interface Hotel {
  id: string
  name: string
  park: 'disney' | 'universal'
  tier: 'value' | 'moderate' | 'deluxe'
  prices: HotelPrice[]
}

export interface PriceData {
  hotels: Hotel[]
  cheapestDay: string | null
  cheapestHotel: Hotel | null
}
