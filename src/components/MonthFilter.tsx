import { Button } from "@/components/ui/button"
import { useYearStore } from "@/store/useYearStore"

type MonthFilterProps = {
  selectedMonth: number | null
  onMonthChange: (month: number | null) => void
}

export const MonthFilter = ({
  selectedMonth,
  onMonthChange,
}: MonthFilterProps) => {
  const startMonth = useYearStore((state) => state.startMonth)

  const months = Array.from({ length: 12 }, (_, index) => {
    return ((startMonth - 1 + index) % 12) + 1
  })

  return (
    <div className="flex items-center gap-2">
      <div className="flex overflow-hidden rounded-md border">
        {months.map((month) => {
          const isSelected = selectedMonth === month

          return (
            <button
              key={month}
              type="button"
              onClick={() => onMonthChange(month)}
              className={`
                h-8 min-w-9 border-r px-2 text-sm
                ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                }
              `}
            >
              {month}月
            </button>
          )
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => onMonthChange(null)}
        className={`
    h-8
    ${selectedMonth === null ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white" : "cursor-pointer"}
  `}
      >
        全期間
      </Button>
    </div>
  )
}