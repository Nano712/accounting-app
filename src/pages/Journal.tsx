import { JournalRow } from "@/components/JournalRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { JournalFormState } from "@/data/JournalFormState ";
import { useJournalForm } from "@/hooks/useJournalForm";

export const Journal=() => { 
  

  const {
  date, setDate,
  dateError, setDateError,
  rows, updateRow,
  description, setDescription,
  totalDebit, totalCredit,
  handleSave,
} = useJournalForm()

  const formState: JournalFormState = {
  date, setDate,
  dateError, setDateError,
  description, setDescription,
}


    return(
        <>
        <div className="grid grid-cols-7 gap-2  p-2  bg-gray-300" >
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
  <Label className="col-span-2" onClick={handleSave}>保存ボタン(仮)</Label>
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
<Button onClick={handleSave}>保存</Button>
       
        </>
    )};
