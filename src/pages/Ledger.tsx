import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useJournalStore } from "@/store/useJournalStore";

export const Ledger =() => {
    const journalEntries = useJournalStore(
    (state) => state.journalEntries
  );

    return(
        <Table>
      <TableHeader>
        <TableRow>
          <TableHead>日付</TableHead>
          {/* <TableHead>仕訳No</TableHead> */}
          <TableHead>借方</TableHead>
          <TableHead>借方金額</TableHead>
          <TableHead>貸方</TableHead>
          <TableHead>貸方金額</TableHead>
          <TableHead>摘要</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {journalEntries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{entry.date.toLocaleDateString()}</TableCell>
            <TableCell>{entry.debitLines.map((line)=><div>{line.account?.name}</div>)}</TableCell>
            <TableCell>{entry.debitLines.map((line)=><div>{line.amount}</div>)}</TableCell>
            <TableCell>{entry.creditLines.map((line)=><div>{line.account?.name}</div>)}</TableCell>
            <TableCell>{entry.creditLines.map((line)=><div>{line.amount}</div>)}</TableCell>
            <TableCell>{entry.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    )};

   //  <div></div>  className="flex flex-col"