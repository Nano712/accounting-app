import type { AccountTitle } from "./AccountTitle"

export type JournalEntry = {
  id: number                    // 仕訳No.
  date: Date                    // 日付
  debitAccount: AccountTitle    // 借方科目
  debitSubAccount?: string      // 借方補助
  debitAmount: number           // 借方金額
  creditAccount: AccountTitle   // 貸方科目
  creditSubAccount?: string     // 貸方補助
  creditAmount: number          // 貸方金額
  description?: string          // 摘要
}