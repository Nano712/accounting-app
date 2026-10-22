import { Fragment } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  assetAccounts, equityAccounts, expenseAccounts,
  liabilityAccounts, revenueAccounts, type AccountTitle,
} from "@/data/AccountTitle"
import type { JournalEntry} from "@/data/JournalEntry"
import { useJournalStore } from "@/store/useJournalStore"
import { useYearStore } from "@/store/useYearStore"
import { sumLines } from "@/utils/sumLines"

const accountGroups = [
  { name: "資産", accounts: assetAccounts },
  { name: "負債", accounts: liabilityAccounts },
  { name: "純資産", accounts: equityAccounts },
  { name: "収益", accounts: revenueAccounts },
  { name: "費用", accounts: expenseAccounts },
]



type TrialBalanceRowProps = {
  account: AccountTitle
  months: number[]
  journalEntries: JournalEntry[]
}

const TrialBalanceRow = ({ account, months, journalEntries  }: TrialBalanceRowProps) => {
  const isDebitNormal = account.category === "asset" || account.category === "expense"

  return (
    <TableRow className="group hover:bg-gray-50">
      <TableCell className="sticky left-0 z-10 bg-background whitespace-nowrap transition-colors group-hover:bg-gray-50">
        {account.code} {account.name}
        </TableCell>
      {months.map((month) => {
        const monthly = journalEntries.filter(
          (entry) => entry.date.getMonth() + 1 === month
        )
        const debit = monthly.reduce((s, e) => s + sumLines(e.debitLines, account.code), 0)
        const credit = monthly.reduce((s, e) => s + sumLines(e.creditLines, account.code), 0)

        return (
          
          <TableCell key={month}  className="text-right last:pr-4">
            {isDebitNormal ? (debit - credit).toLocaleString("ja-JP") : (credit - debit).toLocaleString("ja-JP") }
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export const TrialBalance = () => {
  const startMonth = useYearStore((state) => state.startMonth)
  const fiscalYear = useYearStore((state) => state.fiscalYear)
  const journalEntriesByYear = useJournalStore((state) => state.journalEntriesByYear)
  const journalEntries = journalEntriesByYear[fiscalYear] ?? []

  const months = Array.from({ length: 12 }, (_, i) => ((startMonth - 1 + i) % 12) + 1)

  return (
    <div className="@container max-h-[70dvh] overflow-auto rounded-md border ">
    <Table >
      <TableHeader>
        <TableRow className="bg-gray-300 hover:bg-gray-300">
          <TableHead className="sticky top-0 left-0 z-30  whitespace-nowrap bg-gray-300">勘定科目</TableHead>
          {months.map((month) => (
            <TableHead key={month} className="sticky top-0 z-10 whitespace-nowrap bg-gray-300 group-hover:bg-gray-300">
              {month}月度
              </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {accountGroups.map((group) => (
          <Fragment key={group.name}>
            <TableRow className="bg-muted hover:bg-muted">
              <TableCell colSpan={months.length + 1} className="bg-muted">
                <span className="sticky left-2 font-bold">
                  {group.name}
                </span>
              </TableCell>
            </TableRow>

            {group.accounts.map((account) => (
              <TrialBalanceRow
                key={account.id}
                account={account}
                months={months}
                journalEntries={journalEntries}
              />
            ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
    </div>
  )
}