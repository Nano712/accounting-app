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
import { AccountCombobox } from "@/components/AccountCombobox"
import type { JournalEntry, JournalLine } from "@/data/JournalEntry"
import { getBalanceBefore } from "@/utils/getBalanceBefore"
import { filterEntriesByMonth } from "@/utils/filterEntriesByMonth"

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
  const startMonth = useYearStore((state) => state.startMonth)
  const journalEntriesByYear = useJournalStore(
    (state) => state.journalEntriesByYear
  )
  const journalEntries = journalEntriesByYear[fiscalYear] ?? []

  const filteredEntries = filterEntriesByMonth(
    journalEntries,
    selectedMonth
  ).toSorted((a, b) => a.date.getTime() - b.date.getTime())

  const ledgerRows = accountTitle
    ? filteredEntries.flatMap((entry) => {
        const row = toLedgerRow(entry, accountTitle.code)
        return row ? [{ entry, row }] : []
      })
    : []

  const openingBalance =
    accountTitle && selectedMonth !== null
      ? getBalanceBefore(
          journalEntries,
          accountTitle.code,
          selectedMonth,
          startMonth
        )
      : 0

  const isDebitNormal =
    accountTitle?.category === "asset" || accountTitle?.category === "expense"

  const balances = ledgerRows.reduce<number[]>((acc, item, index) => {
    const previousBalance = index === 0 ? openingBalance : acc[index - 1]

    const change =
      (item.row.side === "debit") === isDebitNormal
        ? item.row.amount
        : -item.row.amount

    acc.push(previousBalance + change)
    return acc
  }, [])



  return (
    <>
      <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-3">
  <div className="w-48">
    <span className="mb-1 block text-xs text-muted-foreground">勘定科目</span>
      <AccountCombobox
          value={accountTitle?.code}
          onValueChange={setAccountTitle}
        />
  </div>
  <div>
    <span className="mb-1 block text-xs text-muted-foreground">期間</span>
       <MonthFilter
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />
  </div>
</div>

      <div className="@container max-h-[70dvh] overflow-auto rounded-md border max-w-5xl">
        <Table className="table-fixed w-full ">
          <TableHeader >
            <TableRow className="bg-gray-300 hover:bg-gray-300">
              <TableHead className="w-12 text-center">日付</TableHead>
              <TableHead className="hidden w-16 text-center lg:table-cell">
                仕訳No.
              </TableHead>
              <TableHead className="hidden w-32 text-center @lg:table-cell">
                相手科目
              </TableHead>
              <TableHead className="w-24 text-center">借方金額</TableHead>
              <TableHead className="w-24 text-center">貸方金額</TableHead>
              <TableHead className="w-30 text-center">残金/繰越金</TableHead>
              <TableHead className="hidden text-center md:table-cell">
                摘要
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {accountTitle !== null && selectedMonth !== null && (
              <TableRow>
                <TableCell className="text-center">繰越</TableCell>
                <TableCell className="hidden lg:table-cell" />
                <TableCell className="hidden @lg:table-cell" />
                <TableCell />
                <TableCell />
                <TableCell className="text-right">
                  {openingBalance.toLocaleString("ja-JP")}
                </TableCell>
                <TableCell className="hidden md:table-cell" />
              </TableRow>
            )}

            {ledgerRows.map(({ entry, row }, index) => (
              <TableRow key={entry.id}>
                <TableCell className="text-center">
                  {entry.date.toLocaleDateString("ja-JP", {
                    month: "numeric",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="hidden text-center lg:table-cell">
                  {entry.id}
                </TableCell>
                <TableCell className="hidden truncate @lg:table-cell">
                  {row.counterAccount}
                </TableCell>
                <TableCell className="text-right">
                  {row.side === "debit" ? row.amount.toLocaleString("ja-JP") : ""}
                </TableCell>
                <TableCell className="text-right">
                  {row.side === "credit" ? row.amount.toLocaleString("ja-JP") : ""}
                </TableCell>
                <TableCell className="text-right">
                  {balances[index].toLocaleString("ja-JP")}
                </TableCell>
                <TableCell className="hidden truncate text-center md:table-cell">
                  {entry.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {accountTitle === null && (
    <p className="py-12 text-center text-sm text-muted-foreground">
      勘定科目を選択してください
    </p>
  )}
      </div>
    </>
  )
}