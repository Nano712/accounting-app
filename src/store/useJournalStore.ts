import { create } from "zustand"
import type { JournalEntry } from "@/data/JournalEntry"

type JournalStore = {
  journalEntries: JournalEntry[]
  addEntry: (entry: JournalEntry) => void
}

export const useJournalStore = create<JournalStore>((set) => ({
  journalEntries: JSON.parse(
    localStorage.getItem("journalEntries") ?? "[]"
  ).map((entry: JournalEntry) => ({
    ...entry,
    date: new Date(entry.date),
  })),
  
  addEntry: (entry) =>
    set((state) => {
      const newEntries = [...state.journalEntries, entry]

      localStorage.setItem(
        "journalEntries",
        JSON.stringify(newEntries)
      )

      return {
        journalEntries: newEntries,
      }
    }),
}))