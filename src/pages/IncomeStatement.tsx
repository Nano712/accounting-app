import { Fragment, useState } from "react"
import {
  Table, TableBody, TableCell,TableRow,
} from "@/components/ui/table"
import {
 expenseAccounts, revenueAccounts, type AccountTitle,
} from "@/data/AccountTitle"
import type { JournalEntry} from "@/data/JournalEntry"
import { useJournalStore } from "@/store/useJournalStore"
import { useYearStore } from "@/store/useYearStore"
import { sumLines } from "@/utils/sumLines"
import { MonthFilter } from "@/components/MonthFilter"
import { filterEntriesByMonth } from "@/utils/filterEntriesByMonth"
import { SummaryTableHeader } from "@/components/SummaryTableHeader"

const accountGroups = [
  { name: "収益", accounts: revenueAccounts },
  { name: "費用", accounts: expenseAccounts },
]

type TrialBalanceRowProps = {
  account: AccountTitle
  filteredEntries: JournalEntry[]
}

  const AccountSummaryRow = ({ account,  filteredEntries }: TrialBalanceRowProps) => {
    
        const isDebitNormal = account.category === "expense"

        const filteredDebit = filteredEntries.reduce((s, e) => s + sumLines(e.debitLines, account.code), 0)
        const filteredCredit  = filteredEntries.reduce((s, e) => s + sumLines(e.creditLines, account.code), 0)

  return (
    <TableRow>
      <TableCell>{account.code} {account.name}</TableCell>
          <TableCell className="text-right">
            {filteredDebit.toLocaleString("ja-JP")}
          </TableCell>
          <TableCell className="text-right">
            {filteredCredit.toLocaleString("ja-JP")}
          </TableCell>
          <TableCell className="text-right">
            {isDebitNormal ? (filteredDebit - filteredCredit).toLocaleString("ja-JP") : (filteredCredit - filteredDebit).toLocaleString("ja-JP")}
          </TableCell>

    </TableRow>
  )
}


export const IncomeStatement = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const fiscalYear = useYearStore((state) => state.fiscalYear)
  const journalEntriesByYear = useJournalStore((state) => state.journalEntriesByYear)
  const journalEntries = journalEntriesByYear[fiscalYear] ?? []
  const filteredEntries= filterEntriesByMonth(journalEntries,selectedMonth)

  return (
    <>
    <div className="mb-4 space-y-3">
      <span className="mb-1 block text-xs text-muted-foreground">期間</span>
    <MonthFilter
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
    </div>

    <div className="max-h-[70dvh] overflow-auto rounded-md border max-w-5xl">
    <Table className="table-fixed w-full">
      <SummaryTableHeader />

      <TableBody>
        {accountGroups.map((group) => (
          <Fragment key={group.name}>
            <TableRow className="bg-muted hover:bg-muted">
              <TableCell colSpan={4} className="font-bold bg-muted">
                <span className="sticky left-2 font-bold">
                 {group.name}
                </span>
              </TableCell>
            </TableRow>

            {group.accounts.map((account) => (
              <AccountSummaryRow
                key={account.id}
                account={account}
                filteredEntries={filteredEntries}
              />
            ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
    </div>
    </>
  )
}