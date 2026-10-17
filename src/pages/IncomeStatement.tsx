import { Fragment, useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
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

const accountGroups = [
  { name: "収益", accounts: revenueAccounts },
  { name: "費用", accounts: expenseAccounts },
]

type TrialBalanceRowProps = {
  account: AccountTitle
  journalEntries: JournalEntry[]
}



export const IncomeStatement = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const fiscalYear = useYearStore((state) => state.fiscalYear)
  const journalEntriesByYear = useJournalStore((state) => state.journalEntriesByYear)
  const journalEntries = journalEntriesByYear[fiscalYear] ?? []

    

  const AccountSummaryRow = ({ account,  journalEntries }: TrialBalanceRowProps) => {
    
        const isDebitNormal = account.category === "expense"
        const filteredEntries= filterEntriesByMonth(journalEntries,selectedMonth)

        const filteredDebit = filteredEntries.reduce((s, e) => s + sumLines(e.debitLines, account.code), 0)
        const filteredCredit  = filteredEntries.reduce((s, e) => s + sumLines(e.creditLines, account.code), 0)

  return (
    <TableRow>
      <TableCell>{account.code} {account.name}</TableCell>
          <TableCell>
            {filteredDebit}
          </TableCell>
          <TableCell>
            {filteredCredit}
          </TableCell>
          <TableCell>
            {isDebitNormal ? filteredDebit - filteredCredit : filteredCredit - filteredDebit}
          </TableCell>

    </TableRow>
  )
}

  return (
    <>
    <MonthFilter
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
    <Table>
      <TableHeader>
        <TableRow>
            <TableHead>勘定科目</TableHead>
            <TableHead>期間借方</TableHead>
            <TableHead>期間貸方</TableHead>
            <TableHead>期間残高</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {accountGroups.map((group) => (
          <Fragment key={group.name}>
            <TableRow>
              <TableCell className="font-bold">
                {group.name}
              </TableCell>
            </TableRow>

            {group.accounts.map((account) => (
              <AccountSummaryRow
                key={account.id}
                account={account}
                journalEntries={journalEntries}
              />
            ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
    </>
  )
}