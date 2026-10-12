import type { AccountTitle } from "@/data/AccountTitle"
import { useState } from "react"

export type FormRow = {
  debitAccount: AccountTitle | null
  debitSubAccount?: string
  debitAmount: number
  creditAccount: AccountTitle | null
  creditSubAccount?: string
  creditAmount: number
}

const emptyRow: FormRow = {
  debitAccount: null,
  debitSubAccount: "",
  debitAmount: 0,
  creditAccount: null,
  creditSubAccount: "",
  creditAmount: 0,
}

const ROW_COUNT = 5

export function useJournalForm() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [dateError, setDateError] = useState(false)
  const [description, setDescription] = useState("")
  const [rows, setRows] = useState<FormRow[]>(
    Array.from({ length: ROW_COUNT }, () => ({ ...emptyRow }))
  )

  const updateRow = (
    index: number,
    updated: Partial<FormRow>
  ) => {
    const newRows = [...rows]

    newRows[index] = {
      ...newRows[index],
      ...updated,
    }

    setRows(newRows)
  }

  const totalDebit = rows.reduce(
    (sum, row) => sum + row.debitAmount,
    0
  )

  const totalCredit = rows.reduce(
    (sum, row) => sum + row.creditAmount,
    0
  )

  return {
    date,
    setDate,
    dateError,
    setDateError,

    description,
    setDescription,

    rows,
    setRows,
    updateRow,

    totalDebit,
    totalCredit,
  }
}