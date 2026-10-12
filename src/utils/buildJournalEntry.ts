import type { JournalEntry, JournalLine } from "@/data/JournalEntry"
import type { FormRow } from "@/hooks/useJournalForm"

type BuildJournalEntryProps = {
  date: Date
  rows: FormRow[]
  description: string
}

export const buildJournalEntry = ({
  date,
  rows,
  description,
}: BuildJournalEntryProps): Omit<JournalEntry, "id"> => {
  const validRows = rows.filter(
    (row) =>
      row.debitAccount ||
      row.debitAmount !== 0 ||
      row.creditAccount ||
      row.creditAmount !== 0
  )

  const debitLines: JournalLine[] = validRows.map((row) => ({
    account: row.debitAccount,
    subAccount: row.debitSubAccount,
    amount: row.debitAmount,
  }))

  const creditLines: JournalLine[] = validRows.map((row) => ({
    account: row.creditAccount,
    subAccount: row.creditSubAccount,
    amount: row.creditAmount,
  }))

  return {
    date,
    debitLines,
    creditLines,
    description,
  }
}