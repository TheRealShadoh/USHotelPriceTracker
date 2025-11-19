import { useState } from 'react'
import { Search, Loader } from 'lucide-react'

interface Deal {
  hotelId: string
  hotelName: string
  startDate: string
  endDate: string
  dayCount: number
  totalPrice: number
  averagePricePerNight: number
  park: 'disney' | 'universal'
}

interface DealsResponse {
  searchParams: { days: number; park: string }
  totalDeals: number
  topDeals: Deal[]
}

export function ConsecutiveDaysSearch() {
  const [numberOfDays, setNumberOfDays] = useState(7)
  const [parkFilter, setParkFilter] = useState<'all' | 'disney' | 'universal'>('all')
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    try {
      setLoading(true)
      setError(null)

      const parkParam = parkFilter === 'all' ? '' : parkFilter
      const url = `/api/deals/consecutive-days?days=${numberOfDays}${parkParam ? `&park=${parkParam}` : ''}`

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to search deals')

      const data: DealsResponse = await response.json()
      setDeals(data.topDeals)
      setSearched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-lg p-8 shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Cheapest Consecutive Days</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days</label>
          <input
            type="number"
            min="1"
            max="365"
            value={numberOfDays}
            onChange={(e) => setNumberOfDays(Math.max(1, Math.min(365, parseInt(e.target.value) || 1)))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Park Filter</label>
          <select
            value={parkFilter}
            onChange={(e) => setParkFilter(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Parks</option>
            <option value="disney">Disney</option>
            <option value="universal">Universal</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {searched && deals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top 20 Deals for {numberOfDays} nights
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-left font-semibold">Hotel</th>
                  <th className="px-4 py-3 text-left font-semibold">Park</th>
                  <th className="px-4 py-3 text-left font-semibold">Check-in</th>
                  <th className="px-4 py-3 text-left font-semibold">Check-out</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                  <th className="px-4 py-3 text-right font-semibold">Per Night</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal, idx) => (
                  <tr key={`${deal.hotelId}-${deal.startDate}`} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                    <td className="px-4 py-3 font-medium text-gray-800">{deal.hotelName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${deal.park === 'disney' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {deal.park === 'disney' ? '🏰 Disney' : '🎪 Universal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatDate(deal.startDate)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatDate(deal.endDate)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-lg text-green-600">${deal.totalPrice.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-blue-600">${deal.averagePricePerNight}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {searched && deals.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No deals found for {numberOfDays} nights. Try adjusting your search.</p>
        </div>
      )}
    </div>
  )
}
