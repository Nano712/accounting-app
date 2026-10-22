import { JournalRow } from "@/components/JournalRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { JournalFormState } from "@/data/JournalFormState ";
import { useJournalForm } from "@/hooks/useJournalForm";
import { useJournalValidation } from "@/hooks/useJournalValidation";
import { useJournalStore } from "@/store/useJournalStore";
import { useYearStore } from "@/store/useYearStore";
import { buildJournalEntry } from "@/utils/buildJournalEntry";
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
<div>借方合計: {totalDebit} / 貸方合計: {totalCredit}</div>
<Button className="cursor-pointer" onClick={handleClickSave}>保存</Button>
       
        </>
    )};
