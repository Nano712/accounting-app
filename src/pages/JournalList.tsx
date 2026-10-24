import { MonthFilter } from "@/components/MonthFilter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useJournalStore } from "@/store/useJournalStore";
import { useYearStore } from "@/store/useYearStore";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import {  useNavigate } from "react-router-dom";

export const JournalList =() => {
    const fiscalYear = useYearStore((state) => state.fiscalYear)
    const journalEntriesByYear = useJournalStore(
  (state) => state.journalEntriesByYear
)

const journalEntries = journalEntriesByYear[fiscalYear] ?? []

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  const filteredEntries =
    selectedMonth === null
      ? journalEntries
      : journalEntries.filter(
          (entry) => entry.date.getMonth() + 1 === selectedMonth
        )
// 編集処理
const navigate = useNavigate();
const handleEdit = (id: number) => {
  navigate(`/journal/edit/${id}`);
};



    return(
        <>
        <div className="mb-4">
      <span className="mb-1 block text-xs text-muted-foreground">期間</span>
      <MonthFilter
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />
        </div>

      <div className="@container max-h-[70dvh] overflow-auto rounded-md border  max-w-5xl">
        <Table className="table-fixed w-full">
      <TableHeader >
        <TableRow className="bg-gray-300 hover:bg-gray-300">
          <TableHead className="hidden w-16 text-center @4xl:table-cell">仕訳No</TableHead>
          <TableHead className="w-14 text-center">日付</TableHead>
          <TableHead className="w-28 text-center">借方</TableHead>
          <TableHead className="w-28 text-center">借方金額</TableHead>
          <TableHead className="w-28 text-center">貸方</TableHead>
          <TableHead className="w-28 text-center">貸方金額</TableHead>
          <TableHead className="hidden text-center @3xl:table-cell">摘要</TableHead>
          <TableHead className="hidden w-20 text-center @2xl:table-cell">操作</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredEntries.map((entry) => (
          <TableRow key={entry.id} className="text-center">
            <TableCell className="hidden  @4xl:table-cell">{entry.id}</TableCell>
            <TableCell >{entry.date.toLocaleDateString("ja-JP", {
  month: "numeric",
  day: "numeric",
})}</TableCell>
            <TableCell>{entry.debitLines.map((line, index)=><div key={index}>{line.account?.name?? "\u00A0"}</div>)}</TableCell>
            <TableCell>{entry.debitLines.map((line, index)=><div key={index}>{line.account ? line.amount.toLocaleString("ja-JP") : "\u00A0"}</div>)}</TableCell>
            <TableCell>{entry.creditLines.map((line, index)=><div key={index}>{line.account?.name?? "\u00A0"}</div>)}</TableCell>
            <TableCell>{entry.creditLines.map((line, index)=><div key={index}>{line.account ? line.amount.toLocaleString("ja-JP") : "\u00A0"}</div>)}</TableCell>
            <TableCell className="hidden @3xl:table-cell">{entry.description}</TableCell>
            <TableCell className="hidden @2xl:table-cell">
              <Button className="cursor-pointer" variant="outline" onClick={()=>handleEdit(entry.id)}>
                編集</Button>
            </TableCell>
            
          
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
    </>
    )};