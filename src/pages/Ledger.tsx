import { MonthFilter } from "@/components/MonthFilter"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useJournalStore } from "@/store/useJournalStore"
import { useYearStore } from "@/store/useYearStore"
import { useState } from "react"
import type { AccountTitle } from "@/data/AccountTitle"
import { AccountCombobox } from "@/components/CommandManyItems"
import type { JournalEntry, JournalLine } from "@/data/JournalEntry"
import { getBalanceBefore } from "@/utils/getBalanceBefore"

type LedgerRow = {
  side: "debit" | "credit"
  amount: number
  counterAccount: string
}

const toLedgerRow = (
  entry: JournalEntry,
  accountCode: string
): LedgerRow | null => {
  const isMine = (line: JournalLine) => line.account?.code === accountCode
  const isFilled = (line: JournalLine) => line.account !== null


  const myDebit = entry.debitLines.filter(isMine)
  const myCredit = entry.creditLines.filter(isMine)

  if (myDebit.length === 0 && myCredit.length === 0) return null

  const side = myDebit.length > 0 ? "debit" : "credit"
  const myLines = side === "debit" ? myDebit : myCredit
  const counterLines = (side === "debit" ? entry.creditLines : entry.debitLines)
    .filter(isFilled)

  const amount = myLines.reduce((sum, line) => sum + line.amount, 0)

  const names = [...new Set(counterLines.map((line) => line.account!.name))]
  const counterAccount = names.length > 1 ? "諸口" : names[0] ?? ""

  return { side, amount, counterAccount }
}

export const Ledger = () => {
  const [accountTitle, setAccountTitle] = useState<AccountTitle | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  const fiscalYear = useYearStore((state) => state.fiscalYear)
  const journalEntriesByYear = useJournalStore((state) => state.journalEntriesByYear)
  const journalEntries = journalEntriesByYear[fiscalYear] ?? []

  const filteredEntries =
    (selectedMonth === null
      ? journalEntries
      : journalEntries.filter(
          (entry) => entry.date.getMonth() + 1 === selectedMonth
        )).toSorted((a, b) => a.date.getTime() - b.date.getTime())

  // 科目が未選択のときは、空配列
  const ledgerRows = accountTitle
    ? filteredEntries.flatMap((entry) => {
        const row = toLedgerRow(entry, accountTitle.code)
        return row ? [{ entry, row }] : []
      })
    : []
// 繰越残高・残金計算
  const startMonth = useYearStore((state) => state.startMonth)

  const openingBalance = accountTitle
  ? getBalanceBefore(
      journalEntries,
      accountTitle.code,
      selectedMonth,
      startMonth
    )
  : 0

  const balances = ledgerRows.reduce<number[]>((acc, item, index) => {
  const previousBalance =
    index === 0 ? openingBalance : acc[index - 1]

    const isDebitNormal =
  accountTitle?.category === "asset" ||
  accountTitle?.category === "expense"

  const change =
    (item.row.side === "debit") === isDebitNormal
      ? item.row.amount
      : -item.row.amount

  acc.push(previousBalance + change)

  return acc
}, [])
    

  return (
    <>
      <MonthFilter
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <AccountCombobox
        value={accountTitle?.code}
        onValueChange={setAccountTitle}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日付</TableHead>
            <TableHead>仕訳No.</TableHead>
            <TableHead>相手科目</TableHead>
            <TableHead>借方金額</TableHead>
            <TableHead>貸方金額</TableHead>
            <TableHead>残金/繰越金</TableHead>
            <TableHead>摘要</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {accountTitle !== null && selectedMonth !== null &&
          <TableRow>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>繰越残高</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>{openingBalance}</TableCell>
          <TableCell></TableCell>
          </TableRow>}

          {ledgerRows.map(({ entry, row },index) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.date.toLocaleDateString()}</TableCell>
              <TableCell>{entry.id}</TableCell>
              <TableCell>{row.counterAccount}</TableCell>
              <TableCell>{row.side === "debit" ? row.amount : ""}</TableCell>
              <TableCell>{row.side === "credit" ? row.amount : ""}</TableCell>
              <TableCell>{balances[index]}</TableCell>
              <TableCell>{entry.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}