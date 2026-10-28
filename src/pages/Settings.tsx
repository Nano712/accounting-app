import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useJournalStore } from "@/store/useJournalStore";
import { useYearStore } from "@/store/useYearStore";
import { toast } from "sonner";
import {
  createBackupJson,
  downloadBackupJson,
  readBackupJson,
} from "@/utils/backupJson";
import { Download, Upload } from "lucide-react";

// null: 閉じている / notice: OKのみ / confirm: キャンセルと続行
type DialogState =
  | null
  | { kind: "notice"; title: string; message: string }
  | {
      kind: "confirm";
      title: string;
      message: string;
      onConfirm: () => void;
    };

export const Settings = () => {
  const setStartMonth = useYearStore((state) => state.setStartMonth);
  const startMonth = useYearStore((state) => state.startMonth);
  const fiscalYear = useYearStore((state) => state.fiscalYear);
  const setFiscalYear = useYearStore((state) => state.setFiscalYear);
  const restoreSettings = useYearStore((state) => state.restoreSettings);

  const journalEntriesByYear = useJournalStore(
    (state) => state.journalEntriesByYear,
  );
  const replaceAllEntries = useJournalStore(
    (state) => state.replaceAllEntries,
  );

  const [inputMonth, setInputMonth] = useState(startMonth);
  const [inputYear, setInputYear] = useState(fiscalYear);
  const [dialog, setDialog] = useState<DialogState>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    const backup = {
      version: 1 as const,
      journalEntriesByYear,
      fiscalYear,
      startMonth,
    };

    const json = createBackupJson(backup);
    downloadBackupJson(json);
    toast.success("バックアップを作成しました");
  };

  const handleSaveYear = () => {
    if (!Number.isInteger(inputYear) || inputYear < 1) {
      setDialog({
        kind: "notice",
        title: "入力エラー",
        message: "会計年度を正しく入力してください",
      });
      return;
    }

    setFiscalYear(inputYear);
    toast.success("会計年度を保存しました");
  };

  const handleSaveMonth = () => {
    if (
      !Number.isInteger(inputMonth) ||
      inputMonth < 1 ||
      inputMonth > 12
    ) {
      setDialog({
        kind: "notice",
        title: "入力エラー",
        message: "月は1から12の間で入力してください",
      });
      return;
    }

    if (inputMonth === startMonth) return;

    setDialog({
      kind: "confirm",
      title: "期首月の変更",
      message:
        "期首月の変更は想定していません。保存済みの仕訳と会計期間がずれ、集計に含まれない仕訳が出る可能性があります。続行しますか？",
      onConfirm: () => {
        setStartMonth(inputMonth);
        toast.success("期首月を保存しました");
      },
    });
  };

  const handleRestore = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      const backup = await readBackupJson(file);

      setDialog({
        kind: "confirm",
        title: "バックアップの復元",
        message:
          "現在の仕訳データと設定をバックアップの内容で置き換えます。続行しますか？",
        onConfirm: () => {
          replaceAllEntries(backup.journalEntriesByYear);
          restoreSettings(backup.fiscalYear, backup.startMonth);

          setInputYear(backup.fiscalYear);
          setInputMonth(backup.startMonth);

          toast.success("バックアップを復元しました");
        },
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "バックアップの復元に失敗しました。";

      setDialog({
        kind: "notice",
        title: "復元に失敗しました",
        message,
      });
    }
  };

  return (
    <>
      <h2>設定</h2>

      <div className="mt-4 space-y-4">
        <section>
          <h3>基本設定</h3>

          <div className="mt-2 flex items-center gap-2">
            <label className="ml-4 w-20 shrink-0">会計年度</label>
            <Input
              type="number"
              min={1}
              value={inputYear}
              onChange={(e) => setInputYear(Number(e.target.value))}
              className="w-32"
            />
            <Button className="cursor-pointer" onClick={handleSaveYear}>
              保存
            </Button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <label className="ml-4 w-20 shrink-0">期首月</label>
            <Input
              type="number"
              min={1}
              max={12}
              value={inputMonth}
              onChange={(e) => setInputMonth(Number(e.target.value))}
              className="w-32"
            />
            <Button className="cursor-pointer" onClick={handleSaveMonth}>
              保存
            </Button>
          </div>
        </section>

        <section>
          <h3>会計設定</h3>

          <div className="mt-2 flex flex-col gap-2">
            <label className=" text-muted-foreground ml-4">勘定科目(準備中)</label>
            <label className=" text-muted-foreground ml-4">税区分(準備中)</label>
          </div>
        </section>

        <section>
          <h3>バックアップ</h3>

          <div className="mt-2 flex flex-wrap gap-2">
            <Button className="cursor-pointer" onClick={handleBackup}>
              <Download />
              JSONバックアップ
            </Button>

            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload />
              JSONから復元
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleRestore}
          />
        </section>
      </div>

      <AlertDialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialog?.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialog?.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {dialog?.kind === "confirm" && (
              <AlertDialogCancel className="cursor-pointer">
                キャンセル
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              className="cursor-pointer"
              onClick={() => {
                if (dialog?.kind === "confirm") dialog.onConfirm();
                setDialog(null);
              }}
            >
              {dialog?.kind === "confirm" ? "続行" : "OK"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};