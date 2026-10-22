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
    if (!date) {
      toast.error("日付を入力してください", {
        className: "!bg-red-500 !text-white",
      })
      return false
    }

    if (dateError) {
      toast.error("不明な日付です", {
        className: "!bg-red-500 !text-white",
      })
      return false
    }

    if (hasInvalidAmount) {
      toast.error("金額欄に不明な文字が存在します", {
        className: "!bg-red-500 !text-white",
      })
      return false
    }

    if (totalDebit === 0 || totalCredit === 0) {
      toast.error("借方・貸方をそれぞれ入力してください", {
        className: "!bg-red-500 !text-white",
      })
      return false
    }

    if (hasAmountError) {
      toast.error("金額に未入力の欄があります", {
        className: "!bg-red-500 !text-white",
      })
      return false
    }

    if (hasAccountError) {
      toast.error("科目に未入力の欄があります", {
        className: "!bg-red-500 !text-white",
      })
      return false
    }

    if (totalDebit !== totalCredit) {
      toast.error("借方と貸方の金額が一致していません", {
        className: "!bg-red-500 !text-white",
      })
      return false
    }

    return true
  }

  return {
    validate,
  }
}