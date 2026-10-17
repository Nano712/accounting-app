import type { JournalLine } from "@/data/JournalEntry";


// 指定した勘定科目コードに一致する仕訳金額を合計する
export const sumLines = (lines: JournalLine[], code: string) =>
  lines
    .filter((line) => line.account?.code === code)
    .reduce((sum, line) => sum + line.amount, 0)