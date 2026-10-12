import { accountTitles } from "@/data/AccountTitle"
import type { JournalEntry, JournalLine } from "@/data/JournalEntry"


  

const sumLines = (lines: JournalLine[], code: string) =>
  lines
    .filter((line) => line.account?.code === code)
    .reduce((sum, line) => sum + line.amount, 0)

const monthIndex = (m: number, startMonth: number) =>
  (m - startMonth + 12) % 12

export const getBalanceBefore = (
  entries: JournalEntry[],
  accountCode: string,
  month: number | null,
  startMonth : number
) => {

  const limit = month === null ? 12 : monthIndex(month, startMonth)

  const previous = entries.filter(
  (e) => monthIndex(e.date.getMonth() + 1, startMonth) < limit
)

  const debit = previous.reduce(
    (s, e) => s + sumLines(e.debitLines, accountCode), 0
  )
  const credit = previous.reduce(
    (s, e) => s + sumLines(e.creditLines, accountCode), 0
  )

  const category = accountTitles.find((a) => a.code === accountCode)?.category
  const isDebitNormal = category === "asset" || category === "expense"

  return isDebitNormal ? debit - credit : credit - debit
}