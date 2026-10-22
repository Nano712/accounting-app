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
// 日付の10の桁の入力に必要
useEffect(() => {
  if (isTypingRef.current) return 
   setInputValue(value ? format(value, "MM/dd") : "")
}, [value])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    isTypingRef.current = true
    const text = e.target.value
    setInputValue(text)
    onErrorChange(false)

    const [inputMonth] = text.split("/")
  const month = Number(inputMonth)
  const year = month < startMonth ? fiscalYear + 1 : fiscalYear

   const parsed = parse(`${year}/${text}`, "yyyy/MM/dd", new Date())
  if (isValid(parsed)) {
    onValueChange(parsed)
    }}

     const handleBlur = () => {
      isTypingRef.current = false
    const parsed = parse(`${fiscalYear}/${inputValue}`, "yyyy/MM/dd", new Date())
    if (!isValid(parsed) && inputValue !== "") {
      onErrorChange(true)
      console.log(parsed)
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