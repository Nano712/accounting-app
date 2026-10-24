import { create } from "zustand"

type FiscalYear = {
  fiscalYear: number
   startMonth: number
  setFiscalYear: (fiscalYear: number) => void
  setStartMonth: (startMonth: number) => void
  restoreSettings: (
  fiscalYear: number,
  startMonth: number,
) => void;
}


export const useYearStore = create<FiscalYear>((set) => ({
  restoreSettings: (fiscalYear, startMonth) => {
  localStorage.setItem("fiscalYear", String(fiscalYear));
  localStorage.setItem("startMonth", String(startMonth));
  set({ fiscalYear, startMonth });
},
  fiscalYear: Number(
    localStorage.getItem("fiscalYear") ?? "2026"
  ),
  setFiscalYear: (fiscalYear) => {
  localStorage.setItem("fiscalYear", String(fiscalYear))
  set({ fiscalYear })
},


  startMonth: Number(
    localStorage.getItem("startMonth") ?? "1"
  ),
  setStartMonth: (startMonth) => {
    localStorage.setItem("startMonth", String(startMonth))
    set({ startMonth })},
}));