import { create } from "zustand"
import type { JournalEntry } from "@/data/JournalEntry"

type JournalStore = {
  journalEntriesByYear: Record<number, JournalEntry[]>
  addEntry: (year: number, entry: Omit<JournalEntry, "id">) => void
  updateEntry: (year: number, id: number, updatedEntry: JournalEntry) => void
  deleteEntry: (year: number, id: number) => void
  replaceAllEntries: (
  entries: Record<number, JournalEntry[]>,
) => void;
}

const STORAGE_KEY = "journalEntriesByYear"


const isValidEntry = (e: unknown): e is JournalEntry => {
  if (typeof e !== "object" || e === null) return false
  const x = e as Record<string, unknown>
  return (
    typeof x.id === "number" &&
    !Number.isNaN(new Date(x.date as string).getTime()) &&
    Array.isArray(x.debitLines) &&
    Array.isArray(x.creditLines)
  )
}

const loadFromStorage = (): Record<number, JournalEntry[]> => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")
    const result: Record<number, JournalEntry[]> = {}

    for (const year in raw) {
      if (!Array.isArray(raw[year])) continue
      result[Number(year)] = raw[year]
        .filter(isValidEntry)
        .map((entry: JournalEntry) => ({ ...entry, date: new Date(entry.date) }))
    }
    return result
  } catch {
    return {}  
  }
}

const saveAndReturn = (newData: Record<number, JournalEntry[]>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  return { journalEntriesByYear: newData }
}

export const useJournalStore = create<JournalStore>((set) => ({
  replaceAllEntries: (entries) =>
  set(() => saveAndReturn(entries)),
  
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