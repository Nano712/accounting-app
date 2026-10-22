import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useYearStore } from "@/store/useYearStore"

type MonthFilterProps = {
  selectedMonth: number | null
  onMonthChange: (month: number | null) => void
}

const ALL = "all"

export const MonthFilter = ({ selectedMonth, onMonthChange }: MonthFilterProps) => {
  const startMonth = useYearStore((state) => state.startMonth)
  const months = Array.from({ length: 12 }, (_, i) => ((startMonth - 1 + i) % 12) + 1)

  return (
    <div className="@container w-full min-w-0">
      {/* 広いとき: ボタン列 */}
      <div className="hidden items-center gap-2 @[520px]:flex">
        <div className="flex overflow-hidden rounded-md border">
          {months.map((month) => (
            <button
              key={month}
              type="button"
              onClick={() => onMonthChange(month)}
              className={`h-7 min-w-9 cursor-pointer whitespace-nowrap border-r px-2 text-sm ${
                selectedMonth === month
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {month}月
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => onMonthChange(null)}
          className={`h-8 cursor-pointer ${
            selectedMonth === null ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white" : ""
          }`}
        >
          全期間
        </Button>
      </div>

      {/* 狭いとき: プルダウン */}
      <div className="@[520px]:hidden">
        <Select
          value={selectedMonth === null ? ALL : String(selectedMonth)}
          onValueChange={(v) => onMonthChange(v === ALL ? null : Number(v))}
        >
          <SelectTrigger className="w-32 h-7 cursor-pointer">
            <SelectValue>
              {selectedMonth === null ? "全期間" : `${selectedMonth}月`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>全期間</SelectItem>
            {months.map((month) => (
              <SelectItem key={month} value={String(month)}>
                {month}月
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}