import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJournalStore } from "@/store/useJournalStore";
import { useYearStore } from "@/store/useYearStore";
import { toast } from "sonner";
import {
  createBackupJson,
  downloadBackupJson,
  readBackupJson,
} from "@/utils/backupJson";
import { Download, Upload } from "lucide-react"


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
  const [error, setError] = useState("");

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
      toast.error("会計年度を正しく入力してください");
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
      toast.error("月は1から12の間で入力してください");
      return;
    }

    setStartMonth(inputMonth);
    toast.success("期首月を保存しました");
  };

  const handleRestore = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setError("");

    try {
      const backup = await readBackupJson(file);

      const confirmed = window.confirm(
        "現在の仕訳データと設定をバックアップの内容で置き換えます。続行しますか？",
      );

      if (!confirmed) return;

      replaceAllEntries(backup.journalEntriesByYear);
      restoreSettings(backup.fiscalYear, backup.startMonth);

      setInputYear(backup.fiscalYear);
      setInputMonth(backup.startMonth);

      toast.success("バックアップを復元しました");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "バックアップの復元に失敗しました。";

      setError(message);
      toast.error(message);
    }
  };

  return (
    <>
      <h2>設定</h2>

      <div className="mt-4 space-y-4">
        <section>
          <h3>基本設定</h3>

          <div className="mt-2 flex items-center gap-2">
            <label className="ml-4">会計年度</label>
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
            <label className="ml-4">期首月</label>
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
            <label className="ml-4">勘定科目</label>
            <label className="ml-4">税区分</label>
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

          {error && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </section>
      </div>
    </>
  );
};