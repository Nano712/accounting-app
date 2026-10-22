import { JournalRow } from "@/components/JournalRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { JournalFormState } from "@/data/JournalFormState ";
import { useJournalForm, type FormRow } from "@/hooks/useJournalForm";
import { useJournalValidation } from "@/hooks/useJournalValidation";
import { useJournalStore } from "@/store/useJournalStore";
import { useYearStore } from "@/store/useYearStore";
import { buildJournalEntry } from "@/utils/buildJournalEntry";
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react";

export const JournalEdit=() => {
     const {
  date, setDate,
  dateError, setDateError,
  rows,setRows, updateRow,
  description, setDescription,
  totalDebit, totalCredit,
} = useJournalForm()

  const formState: JournalFormState = {
  date, setDate,
  dateError, setDateError,
  description, setDescription,
}

const emptyRow: FormRow = {
  debitAccount: null,
  debitSubAccount: "",
  debitAmount: 0,
  creditAccount: null,
  creditSubAccount: "",
  creditAmount: 0,
}

const navigate = useNavigate()
const fiscalYear = useYearStore((state) => state.fiscalYear)
const updateEntry = useJournalStore((state) => state.updateEntry)

const { id } = useParams()

if (!id) {
  toast.error("仕訳IDを取得できませんでした", {
        className: "!bg-red-500 !text-white",
      })
      return null
}


const journalId = Number(id)
// IDを取得し反映
const journalEntries = useJournalStore(
  (state) => state.journalEntriesByYear[fiscalYear] ?? []
)

const entry = journalEntries.find(
  (entry) => entry.id === journalId
)

useEffect(() => {
  if (!entry) return


  setDate(entry.date)
  setDescription(entry.description ?? "")

  const formRows: FormRow[] = entry.debitLines.map((debitLine, index) => {
    const creditLine = entry.creditLines[index]

    return {
      debitAccount: debitLine.account,
      debitSubAccount: debitLine.subAccount ?? "",
      debitAmount: debitLine.amount,
      creditAccount: creditLine?.account ?? null,
      creditSubAccount: creditLine?.subAccount ?? "",
      creditAmount: creditLine?.amount ?? 0,
    }
  })

  while (formRows.length < 5) {
  formRows.push({ ...emptyRow })
}

  setRows(formRows)
}, [entry])

if (!entry) {
  return <p>仕訳が見つかりません。</p>;}

// バリデーションと保存
 const validation = useJournalValidation({
    date,
    dateError,
    rows,
    totalDebit,
    totalCredit,
  })


const handleClickSave = () => {
  if (!validation.validate()) return


  const updatedEntry = buildJournalEntry({
  date: date!,
  rows,
  description,
})

updateEntry(fiscalYear, journalId, {
  ...updatedEntry,
  id: journalId,
})

toast.success("仕訳を更新しました", {
  className: "!bg-green-500 !text-white",
})

navigate(-1)

}

// 削除処理
const deleteEntry = useJournalStore((state) => state.deleteEntry);

const handleDelete = (id: number) => {
  deleteEntry(fiscalYear, id);
  navigate("/journal/list")
};


    return(
        <>
        <div className="grid grid-cols-7 gap-2  mt-3 p-2  bg-gray-300 max-w-5xl" >
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

{!entry
 &&<p>仕訳が見つかりません。</p>}


  {rows.map((row, index) => (
  <JournalRow
    key={index}
    isFirstRow={index === 0}
    index={index}
    row={row}
    onUpdate={(updated) => updateRow(index, updated)}
    formState={formState}
    id={journalId}
    
  />
))}
<div>借方合計: {totalDebit} / 貸方合計: {totalCredit}</div>


<Button onClick={handleClickSave} className={"cursor-pointer"}>保存</Button>
  <AlertDialog>
  <AlertDialogTrigger >
    <Button variant="destructive" className={"cursor-pointer"}>
      削除
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        この仕訳を削除しますか？
      </AlertDialogTitle>

      <AlertDialogDescription>
        削除した仕訳は元に戻せません。
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel className={"cursor-pointer"}>
        キャンセル
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={() => handleDelete(entry.id)}
        className={"cursor-pointer"}
      >
        削除
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
       
        </>
    )};