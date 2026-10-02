import type { AccountTitle } from "@/data/AccountTitle"
import type { JournalEntry, JournalLine } from "@/data/JournalEntry"
import { useJournalStore } from "@/store/useJournalStore"
import { useRef, useState } from "react"
import { toast } from "sonner"

export type FormRow = {
  debitAccount: AccountTitle | null
  debitSubAccount?: string
  debitAmount: number
  creditAccount: AccountTitle | null
  creditSubAccount?: string
  creditAmount: number
}

const emptyRow: FormRow = {
  debitAccount: null,
  debitSubAccount: "",
  debitAmount: 0,
  creditAccount: null,
  creditSubAccount: "",
  creditAmount: 0,
}

const ROW_COUNT = 5


export function useJournalForm() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [dateError, setDateError] = useState<boolean>(false)
  const [description, setDescription] = useState("")
  const [rows, setRows] = useState<FormRow[]>(
    Array.from({ length: ROW_COUNT }, () => ({ ...emptyRow }))
  )
  const addEntry = useJournalStore((state) => state.addEntry)
  const idCounter = useRef(0)

  const updateRow = (index: number, updated: Partial<FormRow>) => {
    const newRows = [...rows]
    newRows[index] = { ...newRows[index], ...updated }
    setRows(newRows)
  }

  const totalDebit = rows.reduce((sum, r) => sum + r.debitAmount, 0)
  const totalCredit = rows.reduce((sum, r) => sum + r.creditAmount, 0)
  

const handleSave = () => {
  console.log(date)
  if (!date) {
    toast.error("日付を入力してください", {
  className: "!bg-red-500 !text-white",})
    return
  }
  if (dateError) {
    toast.error("不明な日付です", {
  className: "!bg-red-500 !text-white",})
    return
  }
    if (totalDebit === 0 || totalCredit === 0) {
  toast.error("借方・貸方をそれぞれ入力してください", { className: "!bg-red-500 !text-white" })
  return
}
  if (totalDebit !== totalCredit) {
    toast.error("借方と貸方の金額が一致していません", {
  className: "!bg-red-500 !text-white",})
    return
  }

  const debitLines: JournalLine[] = rows.map((r) => ({
      account: r.debitAccount,
      subAccount: r.debitSubAccount,
      amount: r.debitAmount,
    }))
    const creditLines: JournalLine[] = rows.map((r) => ({
      account: r.creditAccount,
      subAccount: r.creditSubAccount,
      amount: r.creditAmount,
    }))


  const newId = idCounter.current
  idCounter.current += 1;

  const newEntry: JournalEntry ={
    id:newId,        // 仕訳No.
    date,            // 日付
    debitLines,      // 貸方
    creditLines,     // 借方
    description,     // 摘要
  }

//   保存
  addEntry(newEntry)
  toast.success("保存しました", {className: "!bg-green-500 !text-white",})

//   仕訳日記帳リセット
  setDate(undefined)
  setRows(Array.from({ length: ROW_COUNT }, () => ({ ...emptyRow })))
  setDescription("")

  

  return newEntry
  }


  return {
  date, setDate,
  dateError, setDateError,
  rows, updateRow,
  description, setDescription,
  totalDebit, totalCredit,
  handleSave,
}
}