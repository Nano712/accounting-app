import { Fragment, useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  assetAccounts,
 equityAccounts,
 liabilityAccounts,
 type AccountTitle,
} from "@/data/AccountTitle"
import type { JournalEntry} from "@/data/JournalEntry"
import { useJournalStore } from "@/store/useJournalStore"
import { useYearStore } from "@/store/useYearStore"
import { sumLines } from "@/utils/sumLines"
import { MonthFilter } from "@/components/MonthFilter"
import { getBalanceBefore } from "@/utils/getBalanceBefore"
import { filterEntriesByMonth } from "@/utils/filterEntriesByMonth"

const accountGroups = [
  { name: "資産", accounts: assetAccounts },
  { name: "負債", accounts: liabilityAccounts },
  { name: "純資産", accounts: equityAccounts },
]



type AccountSummaryRowProps = {
  account: AccountTitle
  filteredEntries: JournalEntry[]
  selectedMonth:number | null
  journalEntries:JournalEntry[]
  startMonth:number
}

const AccountSummaryRow = ({
  account,
  filteredEntries,
  selectedMonth,
  journalEntries,
  startMonth,
}: AccountSummaryRowProps) => {
  const isDebitNormal = account.category === "asset"

        const periodDebit = filteredEntries.reduce((s, e) => s + sumLines(e.debitLines, account.code), 0)
        const periodCredit  = filteredEntries.reduce((s, e) => s + sumLines(e.creditLines, account.code), 0)
        const periodBalance =
  selectedMonth === null
    ? getBalanceBefore(journalEntries,account.code,selectedMonth,startMonth)
    : getBalanceBefore(journalEntries,account.code,selectedMonth,startMonth) +
      (isDebitNormal
        ? periodDebit - periodCredit
        : periodCredit - periodDebit);

  return (
    <TableRow>
      <TableCell>{account.code} {account.name}</TableCell>
          <TableCell>
            {periodDebit}
          </TableCell>
          <TableCell>
            {periodCredit}
          </TableCell>
          <TableCell>
            {periodBalance}
          </TableCell>

    </TableRow>
  )
}


export const BalanceSheet = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const startMonth = useYearStore((state) => state.startMonth)
  const fiscalYear = useYearStore((state) => state.fiscalYear)
  const journalEntriesByYear = useJournalStore((state) => state.journalEntriesByYear)
  const journalEntries = journalEntriesByYear[fiscalYear] ?? []

  const filteredEntries= filterEntriesByMonth(journalEntries,selectedMonth)


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
                filteredEntries={filteredEntries}
                selectedMonth={selectedMonth}
                journalEntries={journalEntries}
                startMonth={startMonth}
              />
            ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
    </>
  )
}