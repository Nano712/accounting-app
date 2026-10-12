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
      <MonthFilter
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

        <Table>
      <TableHeader>
        <TableRow>
          <TableHead>仕訳No</TableHead>
          <TableHead>日付</TableHead>
          <TableHead>借方</TableHead>
          <TableHead>借方金額</TableHead>
          <TableHead>貸方</TableHead>
          <TableHead>貸方金額</TableHead>
          <TableHead>摘要</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredEntries.map((entry) => (
          <TableRow key={entry.id} className="text-center">
            <TableCell className="align-top">{entry.id}</TableCell>
            <TableCell className="align-top">{entry.date.toLocaleDateString()}</TableCell>
            <TableCell>{entry.debitLines.map((line)=><div>{line.account?.name?? "\u00A0"}</div>)}</TableCell>
            <TableCell>{entry.debitLines.map((line)=><div>{line.amount ?? "\u00A0"}</div>)}</TableCell>
            <TableCell>{entry.creditLines.map((line)=><div>{line.account?.name?? "\u00A0"}</div>)}</TableCell>
            <TableCell>{entry.creditLines.map((line)=><div>{line.account ? line.amount : "\u00A0"}</div>)}</TableCell>
            <TableCell>{entry.description}</TableCell>
            <Button variant="outline" onClick={()=>handleEdit(entry.id)}>編集</Button>
            
          
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
    )};