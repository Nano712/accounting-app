import { MonthFilter } from "@/components/MonthFilter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useJournalStore } from "@/store/useJournalStore";
import { useState } from "react";
import { Link } from "react-router-dom";

export const JournalList =() => {
    const journalEntries = useJournalStore(
    (state) => state.journalEntries
  );

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  const filteredEntries =
    selectedMonth === null
      ? journalEntries
      : journalEntries.filter(
          (entry) => entry.date.getMonth() + 1 === selectedMonth
        )

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
          {/* <TableHead>仕訳No</TableHead> */}
          <TableHead>借方</TableHead>
          <TableHead>借方金額</TableHead>
          <TableHead>貸方</TableHead>
          <TableHead>貸方金額</TableHead>
          <TableHead>摘要</TableHead>
          <TableHead>編集</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredEntries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="align-top">{entry.id}</TableCell>
            <TableCell className="align-top">{entry.date.toLocaleDateString()}</TableCell>
            <TableCell>{entry.debitLines.map((line)=><div>{line.account?.name?? "\u00A0"}</div>)}</TableCell>
            <TableCell>{entry.debitLines.map((line)=><div>{line.amount ?? "\u00A0"}</div>)}</TableCell>
            <TableCell>{entry.creditLines.map((line)=><div>{line.account?.name?? "\u00A0"}</div>)}</TableCell>
            <TableCell>{entry.creditLines.map((line)=><div>{line.account ? line.amount : "\u00A0"}</div>)}</TableCell>
            <TableCell>{entry.description}</TableCell>
            <TableCell><Link to={`/journal/edit/${entry.id}`}>編集</Link></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
    )};

   //  <div></div>  className="flex flex-col"