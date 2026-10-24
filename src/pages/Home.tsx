import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useJournalStore } from "@/store/useJournalStore";
import { useYearStore } from "@/store/useYearStore";
import { sumByCategory } from "@/utils/sumByCategory";



export const Home =() => {
      const fiscalYear = useYearStore((state) => state.fiscalYear)
      const journalEntriesByYear = useJournalStore((state) => state.journalEntriesByYear)
      const journalEntries = journalEntriesByYear[fiscalYear] ?? []

      const revenue =
        sumByCategory(journalEntries, "revenue", "creditLines") -
        sumByCategory(journalEntries, "revenue", "debitLines");

    const expense = 
       sumByCategory(journalEntries,   "expense", "debitLines") -
       sumByCategory(journalEntries, "expense", "creditLines")


    return(
        <>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
        <CardHeader>
            <CardTitle>当期収益合計</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">¥{revenue.toLocaleString("ja-JP")}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle>当期費用合計</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-2xl font-bold">¥{expense.toLocaleString("ja-JP")}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle>当期純利益</CardTitle>
            </CardHeader>
            <CardContent>
            <p  className={`text-2xl font-bold ${
        expense > revenue ? "text-red-500" : "text-green-500"
      }`}>¥{(revenue - expense).toLocaleString("ja-JP")}</p>
            </CardContent>
        </Card>
    </div>

    
    </>
    
        )};