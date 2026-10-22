import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export const Page404=() => {
    const navigate = useNavigate();
     return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <FileQuestion className="h-12 w-12 text-muted-foreground" />

      <p className="text-6xl font-bold tracking-tight text-muted-foreground">
        404
      </p>

      <h1 className="text-2xl font-semibold">
        ページが見つかりません
      </h1>

      <p className="max-w-md text-sm text-muted-foreground">
        お探しのページは存在しないか、移動した可能性があります。<br />
        URLをご確認いただくか、ホームにお戻りください。
      </p>

      <Button onClick={() => navigate("/")} className="cursor-pointer">
  ホームに戻る
</Button>
    </div>
    )};