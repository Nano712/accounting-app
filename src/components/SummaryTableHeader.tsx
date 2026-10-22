import {
TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

export const SummaryTableHeader = () => (
  <TableHeader>
    <TableRow className="bg-gray-300 hover:bg-gray-300">
      <TableHead className="w-48">勘定科目</TableHead>
      <TableHead className="w-32 text-right">期間借方</TableHead>
      <TableHead className="w-32 text-right">期間貸方</TableHead>
      <TableHead className="w-32 text-right pr-4">期間残高</TableHead>
    </TableRow>
  </TableHeader>
)