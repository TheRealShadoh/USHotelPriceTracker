import { Hotel } from '../types'
import { TrendingDown, Calendar, DollarSign } from 'lucide-react'

interface YearlySummaryProps {
  hotels: Hotel[]
}

export function YearlySummary({ hotels }: YearlySummaryProps) {
  if (hotels.length === 0) return null

  // Calculate statistics
  const allPrices = hotels.flatMap(h => h.prices.map(p => p.price))
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const avgPrice = Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length)

  // Find cheapest and most expensive hotels
  const hotelStats = hotels.map(h => ({
    name: h.name,
    avgPrice: Math.round(h.prices.reduce((a, p) => a + p.price, 0) / h.prices.length),
  })).sort((a, b) => a.avgPrice - b.avgPrice)

  const cheapestHotel = hotelStats[0]
  const mostExpensiveHotel = hotelStats[hotelStats.length - 1]

  // Find best months (lowest average prices)
  const monthlyStats: Record<string, number[]> = {}
  hotels.forEach(hotel => {
    hotel.prices.forEach(price => {
      const month = price.date.substring(0, 7) // YYYY-MM
      if (!monthlyStats[month]) monthlyStats[month] = []
      monthlyStats[month].push(price.price)
    })
  })

  const monthsWithAverages = Object.entries(monthlyStats)
    .map(([month, prices]) => ({
      month,
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    }))
    .sort((a, b) => a.avgPrice - b.avgPrice)

  const cheapestMonth = monthsWithAverages[0]
  const mostExpensiveMonth = monthsWithAverages[monthsWithAverages.length - 1]

  const monthName = (monthStr: string) => {
    const [, month] = monthStr.split('-')
    return new Date(2024, parseInt(month) - 1).toLocaleString('en-US', { month: 'short' })
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 shadow-lg text-white mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6" />
        <h2 className="text-2xl font-bold">12-Month Summary</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pricing Stats */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" />
            <p className="text-sm opacity-90">Average Nightly Rate</p>
          </div>
          <p className="text-3xl font-bold">${avgPrice}</p>
          <p className="text-xs opacity-75 mt-1">
            ${minPrice} - ${maxPrice} range
          </p>
        </div>

        {/* Cheapest Hotel */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4" />
            <p className="text-sm opacity-90">Budget-Friendly</p>
          </div>
          <p className="text-xl font-bold truncate">{cheapestHotel.name}</p>
          <p className="text-xs opacity-75 mt-1">${cheapestHotel.avgPrice}/night avg</p>
        </div>

        {/* Cheapest Month */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" />
            <p className="text-sm opacity-90">Best Month</p>
          </div>
          <p className="text-2xl font-bold">{monthName(cheapestMonth.month)}</p>
          <p className="text-xs opacity-75 mt-1">${cheapestMonth.avgPrice}/night avg</p>
        </div>

        {/* Most Expensive Month */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" />
            <p className="text-sm opacity-90">Peak Season</p>
          </div>
          <p className="text-2xl font-bold">{monthName(mostExpensiveMonth.month)}</p>
          <p className="text-xs opacity-75 mt-1">${mostExpensiveMonth.avgPrice}/night avg</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/30">
        <p className="text-sm opacity-90">
          💡 Tip: Avoid {monthName(mostExpensiveMonth.month)} for best savings. Best deals in {monthName(cheapestMonth.month)}!
        </p>
      </div>
    </div>
  )
}
