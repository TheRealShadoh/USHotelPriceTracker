import { useEffect, useState } from 'react'
import { Hotel, HotelPrice } from './types'
import { HotelCard } from './components/HotelCard'
import { CheapestDay } from './components/CheapestDay'
import { ConsecutiveDaysSearch } from './components/ConsecutiveDaysSearch'
import { YearlySummary } from './components/YearlySummary'
import { MonthFilter } from './components/MonthFilter'
import { Loader } from 'lucide-react'
import { fetchHotels as fetchHotelsApi } from './api'

function App() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterPark, setFilterPark] = useState<'all' | 'disney' | 'universal'>('all')
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  useEffect(() => {
    loadHotels()
  }, [])

  const loadHotels = async () => {
    try {
      setLoading(true)
      const data = await fetchHotelsApi()
      setHotels(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getCheapestDay = () => {
    if (hotels.length === 0) return null

    let cheapestDay: string | null = null
    let lowestAvg = Infinity

    const allPrices: Record<string, number[]> = {}

    hotels.forEach(hotel => {
      hotel.prices.forEach(price => {
        if (!allPrices[price.date]) allPrices[price.date] = []
        allPrices[price.date].push(price.price)
      })
    })

    Object.entries(allPrices).forEach(([date, prices]) => {
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length
      if (avg < lowestAvg) {
        lowestAvg = avg
        cheapestDay = date
      }
    })

    return { date: cheapestDay, avgPrice: lowestAvg }
  }

  const getCheapestHotel = () => {
    if (hotels.length === 0) return null
    return hotels.reduce((prev, curr) => {
      const prevAvg = prev.prices.reduce((a, p) => a + p.price, 0) / prev.prices.length
      const currAvg = curr.prices.reduce((a, p) => a + p.price, 0) / curr.prices.length
      return currAvg < prevAvg ? curr : prev
    })
  }

  const getMinPrice = () => {
    if (hotels.length === 0) return 0
    return Math.min(...hotels.flatMap(h => h.prices.map(p => p.price)))
  }

  const filteredHotels = hotels.filter(h => filterPark === 'all' || h.park === filterPark)
  const cheapestDay = getCheapestDay()
  const cheapestHotel = getCheapestHotel()
  const minPrice = getMinPrice()

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            🏨 Theme Park Hotel Price Tracker
          </h1>
          <p className="text-gray-600 text-lg">Find the cheapest days and hotels at Disney & Universal Studios</p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-8">
          {(['all', 'disney', 'universal'] as const).map(park => (
            <button
              key={park}
              onClick={() => setFilterPark(park)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filterPark === park
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/60 text-gray-700 hover:bg-white/90 backdrop-blur-md'
              }`}
            >
              {park === 'all' && 'All Parks'}
              {park === 'disney' && '🏰 Disney'}
              {park === 'universal' && '🎪 Universal'}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Yearly Summary */}
            <YearlySummary hotels={hotels} />

            {/* Consecutive Days Search */}
            <div className="mb-12">
              <ConsecutiveDaysSearch />
            </div>

            {/* Month Filter */}
            <MonthFilter selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

            {/* Cheapest Day Card */}
            {cheapestDay && (
              <div className="mb-12">
                <CheapestDay date={cheapestDay.date} averagePrice={cheapestDay.avgPrice} />
              </div>
            )}

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map(hotel => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  cheapestPrice={minPrice}
                  isLowestPrice={cheapestHotel?.id === hotel.id}
                  monthFilter={selectedMonth}
                />
              ))}
            </div>

            {filteredHotels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No hotels found for the selected filter.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
