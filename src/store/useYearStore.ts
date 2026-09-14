import { create } from "zustand"

type FiscalYear = {
  fiscalYear: number
   startMonth: number
  setFiscalYear: (fiscalYear: number) => void
  setStartMonth: (startMonth: number) => void
}

export const useYearStore = create<FiscalYear>((set) => ({
  fiscalYear: 2026,
  setFiscalYear: (fiscalYear) => set({ fiscalYear }),
  startMonth: 1,
  setStartMonth: (startMonth) => set({ startMonth }),
}));