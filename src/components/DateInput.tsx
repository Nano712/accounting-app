import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { format, parse, isValid } from "date-fns"
import { cn } from "cn"
import { useYearStore } from "@/store/useYearStore"

type DateInputProps = {
  value?: Date
  onValueChange: (date: Date | undefined) => void
  isError: boolean
  onErrorChange:(error: boolean) => void
}




export function DateInput({ value, onValueChange,isError,onErrorChange,}: DateInputProps) {
  const [inputValue, setInputValue] = useState(
    value ? format(value, "MM/dd") : ""
  )

  const fiscalYear = useYearStore((state)=>state.fiscalYear);
  const startMonth = useYearStore((state)=>state.startMonth);
  const isTypingRef = useRef(false)

//年度の計算に必要 
  const getCalendar = (text: string) => {
  const month = Number(text.split("/")[0])
  return month < startMonth ? fiscalYear + 1 : fiscalYear
}


// 日付の10の位の入力に必要
useEffect(() => {
  if (isTypingRef.current) return 
   setInputValue(value ? format(value, "MM/dd") : "")
}, [value])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    isTypingRef.current = true
    const text = e.target.value
    setInputValue(text)
    onErrorChange(false)


   const parsed = parse(`${getCalendar(text)}/${text}`, "yyyy/MM/dd", new Date())
  if (isValid(parsed)) {
    onValueChange(parsed)
    }}

     const handleBlur = () => {
      isTypingRef.current = false

    const parsed = parse(`${getCalendar(inputValue)}/${inputValue}`, "yyyy/MM/dd", new Date())
    if (!isValid(parsed) && inputValue !== "") {
      onErrorChange(true)
    }
  }



  return (
    <Input
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={"MM/DD"}
      className={cn(" rounded-none", isError && "border-3 border-red-500")}
    />
  )
}