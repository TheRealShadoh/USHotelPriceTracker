import { Calendar, Zap } from 'lucide-react'

interface CheapestDayProps {
  date: string
  averagePrice: number
}

export function CheapestDay({ date, averagePrice }: CheapestDayProps) {
  const dateObj = new Date(date)
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg p-8 shadow-lg text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-lg backdrop-blur-md">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm opacity-90">Cheapest Day to Book</p>
            <h2 className="text-3xl font-bold">{dayName}</h2>
            <p className="text-sm opacity-75">{formattedDate}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">Average Price</p>
          <p className="text-4xl font-bold">${Math.round(averagePrice)}</p>
        </div>
      </div>
    </div>
  )
}
