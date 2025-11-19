import { Hotel, HotelPrice } from '../types'
import { TrendingDown, MapPin } from 'lucide-react'

interface HotelCardProps {
  hotel: Hotel
  cheapestPrice: number
  isLowestPrice: boolean
  monthFilter?: string | null
}

export function HotelCard({ hotel, cheapestPrice, isLowestPrice, monthFilter }: HotelCardProps) {
  // Filter prices by month if selected
  const filteredPrices = monthFilter
    ? hotel.prices.filter(p => p.date.startsWith(`2024-${monthFilter}`))
    : hotel.prices

  const avgPrice = filteredPrices.reduce((acc, p) => acc + p.price, 0) / filteredPrices.length
  const minPrice = Math.min(...filteredPrices.map(p => p.price))
  const maxPrice = Math.max(...filteredPrices.map(p => p.price))

  const getPriceColor = (price: number) => {
    if (price <= cheapestPrice * 1.1) return 'text-green-600'
    if (price <= cheapestPrice * 1.3) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`rounded-lg p-6 backdrop-blur-md transition-all ${isLowestPrice ? 'bg-gradient-to-br from-green-100 to-emerald-100 ring-2 ring-green-400 shadow-lg' : 'bg-white/80 shadow-md'}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {hotel.park === 'disney' ? '🏰 Disney' : '🎪 Universal'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">{hotel.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{hotel.tier} Tier</p>
        </div>
        {isLowestPrice && <TrendingDown className="w-6 h-6 text-green-600" />}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Minimum</p>
          <p className={`text-2xl font-bold ${getPriceColor(minPrice)}`}>${minPrice}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Average</p>
          <p className="text-2xl font-bold text-blue-600">${Math.round(avgPrice)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Maximum</p>
          <p className={`text-2xl font-bold ${getPriceColor(maxPrice)}`}>${maxPrice}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        {monthFilter && (
          <p className="text-xs text-blue-600 font-semibold mb-2">
            📅 Filtered to selected month
          </p>
        )}
        <p className="text-xs text-gray-600">Price Range: ${minPrice} - ${maxPrice}</p>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
            style={{ width: `${((avgPrice - minPrice) / (maxPrice - minPrice)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
