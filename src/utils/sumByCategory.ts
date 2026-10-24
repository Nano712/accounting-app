import type { JournalEntry } from "@/data/JournalEntry";

export const sumByCategory = (
  entries: JournalEntry[],
  category: "revenue" | "expense",
  side: "debitLines" | "creditLines",
) =>
  entries.reduce(
    (sum, entry) =>
      sum +
      entry[side]
        .filter((line) => line.account?.category === category)
        .reduce((s, line) => s + line.amount, 0),
    0,
  );