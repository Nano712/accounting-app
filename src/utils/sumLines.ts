import type { JournalLine } from "@/data/JournalEntry";


// 指定した勘定科目コードに一致する仕訳金額を合計する
// code が null のときは、科目を絞らず全行を合計する
export const sumLines = (lines: JournalLine[], code: string|null) =>
  lines
    .filter((line) => code === null || line.account?.code === code)
    .reduce((sum, line) => sum + line.amount, 0)