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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <option value="disney">Disney Only</option>
            <option value="universal">Universal Only</option>
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
                Search Deals
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick presets */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">Quick Presets</p>
        <div className="flex flex-wrap gap-2">
          {[3, 5, 7, 10, 14].map(days => (
            <button
              key={days}
              onClick={() => setNumberOfDays(days)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                numberOfDays === days
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {days} {days === 1 ? 'night' : 'nights'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {searched && deals.length > 0 && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ✨ Top {Math.min(20, deals.length)} Deals for {numberOfDays} nights
            </h3>
            <p className="text-sm text-gray-600">
              Found {deals.length} available options across {parkFilter === 'all' ? 'all parks' : parkFilter === 'disney' ? 'Disney hotels' : 'Universal hotels'}.
              Sorted by lowest total price.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-b-2 border-blue-700">
                  <th className="px-4 py-3 text-left font-semibold">Hotel</th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Park</th>
                  <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Dates</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                  <th className="px-4 py-3 text-right font-semibold">/Night</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal, idx) => (
                  <tr key={`${deal.hotelId}-${deal.startDate}`} className={`border-b transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-800">{deal.hotelName}</p>
                        <p className="text-xs text-gray-500 md:hidden">
                          {deal.park === 'disney' ? '🏰 Disney' : '🎪 Universal'} • {formatDate(deal.startDate)} to {formatDate(deal.endDate)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${deal.park === 'disney' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {deal.park === 'disney' ? '🏰 Disney' : '🎪 Universal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-700 text-xs">
                      <div className="whitespace-nowrap">
                        <p>{formatDate(deal.startDate)}</p>
                        <p>→ {formatDate(deal.endDate)}</p>
                      </div>
                    </td>
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
