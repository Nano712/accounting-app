import { create } from "zustand"
import type { JournalEntry } from "@/data/JournalEntry"

type JournalStore = {
  journalEntries: JournalEntry[]
  addEntry: (entry: JournalEntry) => void
}

export const useJournalStore = create<JournalStore>((set) => ({
  journalEntries: [],
  addEntry: (entry) =>
    set((state) => ({
      journalEntries: [...state.journalEntries, entry],
    })),
}))