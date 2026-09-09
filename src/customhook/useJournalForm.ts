import type { AccountTitle } from "@/data/AccountTitle"
import type { JournalEntry } from "@/data/JournalEntry"
import { useRef, useState } from "react"
import { toast } from "sonner"


export function useJournalForm(){
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [debitAccount, setDebitAccount] = useState<AccountTitle | null>(null)
  const [debitSubAccount, setDebitSubAccount] = useState("")
  const [debitAmount, setDebitAmount] = useState(0)
  const [creditAccount, setCreditAccount] = useState<AccountTitle | null>(null)
  const [creditSubAccount, setCreditSubAccount] = useState("")
  const [creditAmount, setCreditAmount] = useState(0)
  const [description, setDescription] = useState("")
  

// contextで管理予定
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])

  const idCounter = useRef(0)

const handleSave = () => {
  if (!date) {
    toast.error("日付を入力してください", {
  className: "!bg-red-500 !text-white",})
    return
  }
  if (!debitAccount) {
    toast.error("借方科目を選択してください", {
  className: "!bg-red-500 !text-white",})
    return
  }
  if (!creditAccount) {
    toast.error("貸方科目を選択してください", {
  className: "!bg-red-500 !text-white",})
    return
  }
  if (debitAmount <= 0) {
    toast.error("借方金額を入力してください", {
  className: "!bg-red-500 !text-white",})
    return
  }
  if (creditAmount <= 0) {
    toast.error("貸方金額を入力してください", {
  className: "!bg-red-500 !text-white",})
    return
  }
  if (debitAmount !== creditAmount) {
    toast.error("借方と貸方の金額が一致していません", {
  className: "!bg-red-500 !text-white",})
    return
  }


  const newId = idCounter.current
  idCounter.current += 1;

  const newEntry: JournalEntry ={
    id:newId,        // 仕訳No.
    date,            // 日付
    debitAccount,    // 借方科目
    debitSubAccount, // 借方補助
    debitAmount,     // 借方金額
    creditAccount,   // 貸方科目
    creditSubAccount,// 貸方補助
    creditAmount,    // 貸方金額
    description,     // 摘要
  }

//   保存
  setJournalEntries([...journalEntries, newEntry])
  toast.success("保存しました", {className: "!bg-green-500 !text-white",
})

//   仕訳日記帳リセット
  setDate(undefined)
  setDebitAccount(null)
  setDebitSubAccount("")
  setDebitAmount(0)
  setCreditAccount(null)
  setCreditSubAccount("")
  setCreditAmount(0)
  setDescription("")

  

  return newEntry
  }


  return {
    date, setDate,
    debitAccount, setDebitAccount,
    debitSubAccount, setDebitSubAccount,
    debitAmount, setDebitAmount,
    creditAccount, setCreditAccount,
    creditSubAccount, setCreditSubAccount,
    creditAmount, setCreditAmount,
    description, setDescription,
    handleSave,
  }
}