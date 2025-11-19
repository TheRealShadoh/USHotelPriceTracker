import { Filter } from 'lucide-react'

interface MonthFilterProps {
  selectedMonth: string | null
  onMonthChange: (month: string | null) => void
}

export function MonthFilter({ selectedMonth, onMonthChange }: MonthFilterProps) {
  const months = [
    { value: '01', label: 'Jan' },
    { value: '02', label: 'Feb' },
    { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' },
    { value: '05', label: 'May' },
    { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' },
    { value: '08', label: 'Aug' },
    { value: '09', label: 'Sep' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' },
  ]

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Filter by Month</h3>
      </div>

      <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
        {/* "All Year" button */}
        <button
          onClick={() => onMonthChange(null)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            selectedMonth === null
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Year
        </button>

        {/* Month buttons */}
        {months.map(month => (
          <button
            key={month.value}
            onClick={() => onMonthChange(month.value)}
            className={`px-3 py-2 rounded-lg font-semibold transition-all text-sm ${
              selectedMonth === month.value
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {month.label}
          </button>
        ))}
      </div>

      {selectedMonth && (
        <p className="text-sm text-gray-600 mt-4">
          Showing prices for the selected month. Prices vary by day of week and demand.
        </p>
      )}
    </div>
  )
}
