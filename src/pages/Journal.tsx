import { JournalRow } from "@/components/JournalRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { JournalFormState } from "@/data/JournalFormState";
import { useJournalForm } from "@/hooks/useJournalForm";
import { useJournalValidation } from "@/hooks/useJournalValidation";
import { useJournalStore } from "@/store/useJournalStore";
import { useYearStore } from "@/store/useYearStore";
import { buildJournalEntry } from "@/utils/buildJournalEntry";
import { focusNext } from "@/utils/focusNext";
import { toast } from "sonner"

export const Journal=() => { 

  const {
  date, setDate,
  dateError, setDateError,
  rows, setRows, updateRow,
  description, setDescription,
  totalDebit, totalCredit,
} = useJournalForm()

  const formState: JournalFormState = {
  date, setDate,
  dateError, setDateError,
  description, setDescription,
}

 const validation = useJournalValidation({
    date,
    dateError,
    rows,
    totalDebit,
    totalCredit,
  })


  const fiscalYear = useYearStore((state) => state.fiscalYear)
  const addEntry = useJournalStore((state) => state.addEntry)

const handleClickSave = () => {
  if (!validation.validate()) return

  addEntry(fiscalYear, buildJournalEntry({date: date!,
  rows,
  description}))

  toast.success("保存しました", { className: "!bg-green-500 !text-white" })

setDate(undefined)
  setDateError(false)
  setRows(
    Array.from({ length: 5 }, () => ({
      debitAccount: null,
      debitSubAccount: "",
      debitAmount: 0,
      creditAccount: null,
      creditSubAccount: "",
      creditAmount: 0,
    }))
  )
  setDescription("")
  
}

const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const target = e.target as HTMLElement
  if (!target.closest("[data-journal-form]")) return

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault()
    handleClickSave()
    return
  }

  if (e.key !== "Enter" || e.nativeEvent.isComposing) return

  e.preventDefault()
  focusNext(target)
}

    return(
        <>
        <div className="grid max-w-5xl grid-cols-7 gap-2 my-3 p-2  bg-gray-300" >
  <Label>日付</Label>
  <Label>借方科目</Label>
  <Label>借方金額</Label>
  <Label>貸方科目</Label>
  <Label>貸方金額</Label>
  <Label className="col-span-2" >摘要</Label>

  <Label>仕訳No.</Label>
  <Label>借方補助</Label>
  <Label>消費税額</Label>
  <Label>貸方補助</Label>
  <Label>消費税額</Label>
</div>


  <div data-journal-form onKeyDown={handleKeyDown}>
    {rows.map((row, index) => (
      <JournalRow
        key={index}
        isFirstRow={index === 0}
        index={index}
        row={row}
        onUpdate={(updated) => updateRow(index, updated)}
        formState={formState}
        
      />
  ))}
</div>
<div className="mt-2">借方合計: {totalDebit} / 貸方合計: {totalCredit}</div>
<div className="mt-3 flex max-w-5xl items-center justify-end gap-2">
  <span className="text-sm text-muted-foreground">(Ctrl / Cmd + S)</span>
  <Button className="cursor-pointer" onClick={handleClickSave}>保存</Button>
</div>
       
        </>
    )};
