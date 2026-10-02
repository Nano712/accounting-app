import type { AccountTitle } from "./AccountTitle"

export type JournalLine = {
  account: AccountTitle | null
  subAccount?: string
  amount: number
}

export type JournalEntry = {
  id: number
  date: Date
  debitLines: JournalLine[]
  creditLines: JournalLine[]
  description?: string
}