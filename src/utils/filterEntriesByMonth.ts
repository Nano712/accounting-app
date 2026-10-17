import type { JournalEntry } from "@/data/JournalEntry";

export const filterEntriesByMonth = (
  journalEntries: JournalEntry[],
  selectedMonth: number | null
) => {
  return journalEntries.filter(
    (entry) =>
      selectedMonth === null ||
      entry.date.getMonth() + 1 === selectedMonth
  );
};