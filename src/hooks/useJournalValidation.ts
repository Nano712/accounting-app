import type { FormRow } from "./useJournalForm"
import { toast } from "sonner"

type JournalValidationProps = {
  date: Date | undefined
  dateError: boolean
  rows: FormRow[]
  totalDebit: number
  totalCredit: number
}

export function useJournalValidation({
  date,
  dateError,
  rows,
  totalDebit,
  totalCredit,
}: JournalValidationProps) {
  
  const hasAccountError = rows.some(
    (r) =>
      (r.debitAmount !== 0 && !r.debitAccount) ||
      (r.creditAmount !== 0 && !r.creditAccount)
  )

  const hasAmountError = rows.some(
    (r) =>
      (r.debitAmount === 0 && r.debitAccount) ||
      (r.creditAmount === 0 && r.creditAccount)
  )

  const hasInvalidAmount = rows.some((r) =>
  [r.debitAmount, r.creditAmount].some((n) => !Number.isInteger(n))
)

  const validate = () => {
    const checks = [
  { failed: !date,  message: "日付を入力してください" }, 
  { failed: dateError, message: "不明な日付です" },
  { failed: hasInvalidAmount,  message: "金額は整数で入力してください" },
  { failed: totalDebit === 0 || totalCredit === 0,  message: "借方・貸方をそれぞれ入力してください" },
  { failed: hasAmountError,  message: "金額に未入力の欄があります" },
  { failed: hasAccountError,  message: "科目に未入力の欄があります" },
  { failed: totalDebit !== totalCredit,  message: "借方と貸方の金額が一致していません" },
]
    const firstError = checks.find((c) => c.failed)
    const showError = (message:string)=>{
   toast.error(message, {
        className: "!bg-red-500 !text-white",
      })
}

    if(firstError){
    showError(firstError.message)
    return false
    }
    return true
  }

  return {
    validate,
  }
}