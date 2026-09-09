import { useEffect, useState ,type ChangeEvent} from "react"

import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "cn"
import { format, parse, isValid } from "date-fns"

type DateInputProps = {
  value?: Date
  onValueChange: (date: Date | undefined) => void
  className?: string
}
export function DateInput({ value, onValueChange, className }: DateInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(
    value ? format(value, "MM/dd") : ""
  )
    const [error, setError] = useState(false)

   const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setInputValue(text)

    const currentYear = new Date().getFullYear()
    const parsed = parse(`${currentYear}/${text}`, "yyyy/MM/dd", new Date())

    isValid(parsed)? setError(false):setError(true);
  }

  useEffect(() => {
  if (!value) {
    setInputValue("")}
}, [value])

  const handleInputBlur = () => {
  if (error) {
    setInputValue("")
    setError(false)
    onValueChange(undefined)
  }
}


  return (
    <div className={cn("relative w-full", className)}>
      <Input
        value={inputValue}
        placeholder="日付を入力"
        className="pr-10 rounded-none"
        onChange={handleInputChange}
         onBlur={handleInputBlur} 
         
      />

      <Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger
    render={
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3"
      />
    }
  >
    <CalendarIcon className="size-4 opacity-50" />
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="end">
    <Calendar
      mode="single"
      required
      selected={value}
      onSelect={(date) => {
        onValueChange(date)
        if (date) {
        setInputValue(format(date, "MM/dd"))}
        setOpen(false)
      }}
      className="bg-card" 
    />
  </PopoverContent>
</Popover>
    </div>
  )
}