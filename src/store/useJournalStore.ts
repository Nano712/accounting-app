import { create } from "zustand"
import type { JournalEntry } from "@/data/JournalEntry"

type JournalStore = {
  journalEntriesByYear: Record<number, JournalEntry[]>
  addEntry: (year: number, entry: Omit<JournalEntry, "id">) => void
  updateEntry: (year: number, id: number, updatedEntry: JournalEntry) => void
  deleteEntry: (year: number, id: number) => void
}

const STORAGE_KEY = "journalEntriesByYear"

const loadFromStorage = (): Record<number, JournalEntry[]> => {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")
  const result: Record<number, JournalEntry[]> = {}

  for (const year in raw) {
    result[Number(year)] = raw[year].map((entry: JournalEntry) => ({
      ...entry,
      date: new Date(entry.date),
    }))
  }

  return result
}

const saveAndReturn = (newData: Record<number, JournalEntry[]>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  return { journalEntriesByYear: newData }
}

export const useJournalStore = create<JournalStore>((set) => ({
  journalEntriesByYear: loadFromStorage(),
// 保存処理
  addEntry: (year, entry) =>
    set((state) => {
      const yearEntries = state.journalEntriesByYear[year] ?? []
      const newId = Math.max(0, ...yearEntries.map((entry) => entry.id)) + 1
      
      const newEntry: JournalEntry = {
      ...entry,
      id: newId,
    }

      const newData = {
        ...state.journalEntriesByYear,
        [year]: [...yearEntries, newEntry],
      }
      return saveAndReturn(newData)
    }),
// 編集処理
  updateEntry: (year, id, updatedEntry) =>
    set((state) => {
      const yearEntries = state.journalEntriesByYear[year] ?? []
      const newData = {
        ...state.journalEntriesByYear,
        [year]: yearEntries.map((entry) => (entry.id === id ? updatedEntry : entry)),
      }
      return saveAndReturn(newData)
    }),
// 削除処理
  deleteEntry: (year, id) =>
    set((state) => {
      const yearEntries = state.journalEntriesByYear[year] ?? []
      const newData = {
        ...state.journalEntriesByYear,
        [year]: yearEntries.filter((entry) => entry.id !== id),
      }
      return saveAndReturn(newData)
    }),
}))