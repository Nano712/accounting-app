
import type { JournalEntry, JournalLine } from "@/data/JournalEntry";
import type { AccountTitle } from "@/data/AccountTitle";

export type BackupData = {
  version: 1;
  journalEntriesByYear: Record<number, JournalEntry[]>;
  fiscalYear: number;
  startMonth: number;
};

export const createBackupJson = (backup: BackupData): string => {
  return JSON.stringify(backup, null, 2);
};

export const downloadBackupJson = (json: string) => {
  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "accounting-backup.json";
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const isObject = (
  value: unknown,
): value is Record<string, unknown> => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
};

const isValidAccountTitle = (
  value: unknown,
): value is AccountTitle => {
  if (!isObject(value)) return false;

  return (
    Number.isInteger(value.id) &&
    typeof value.code === "string" &&
    typeof value.name === "string" &&
    ["asset", "liability", "equity", "revenue", "expense"].includes(
      String(value.category),
    )
  );
};

const isValidJournalLine = (
  value: unknown,
): value is JournalLine => {
  if (!isObject(value)) return false;

  const validAccount =
    value.account === null || isValidAccountTitle(value.account);

  const validSubAccount =
    value.subAccount === undefined ||
    typeof value.subAccount === "string";

  return (
    validAccount &&
    validSubAccount &&
    typeof value.amount === "number" &&
    Number.isInteger(value.amount)
  );
};

const isValidJournalEntry = (
  value: unknown,
): value is Omit<JournalEntry, "date"> & { date: string } => {
  if (!isObject(value)) return false;

  const validDescription =
    value.description === undefined ||
    typeof value.description === "string";

  return (
    Number.isInteger(value.id) &&
    typeof value.date === "string" &&
    !Number.isNaN(Date.parse(value.date)) &&
    Array.isArray(value.debitLines) &&
    value.debitLines.every(isValidJournalLine) &&
    Array.isArray(value.creditLines) &&
    value.creditLines.every(isValidJournalLine) &&
    validDescription
  );
};

export const readBackupJson = async (
  file: File,
): Promise<BackupData> => {
  let data: unknown;

  try {
    data = JSON.parse(await file.text());
  } catch {
    throw new Error("JSONファイルの形式が正しくありません。");
  }

  if (!isObject(data)) {
    throw new Error("バックアップデータが正しくありません。");
  }

  if (
    data.version !== 1 ||
    !Number.isInteger(data.fiscalYear) ||
    !Number.isInteger(data.startMonth) ||
    (data.startMonth as number) < 1 ||
    (data.startMonth as number) > 12 ||
    !isObject(data.journalEntriesByYear)
  ) {
    throw new Error("バックアップデータの基本情報が正しくありません。");
  }

  const entriesByYear: Record<number, JournalEntry[]> = {};

  for (const [yearString, entries] of Object.entries(
    data.journalEntriesByYear,
  )) {
    const year = Number(yearString);

    if (
      !Number.isInteger(year) ||
      !Array.isArray(entries) ||
      !entries.every(isValidJournalEntry)
    ) {
      throw new Error("年度別の仕訳データが正しくありません。");
    }

    entriesByYear[year] = entries.map((entry) => ({
      ...entry,
      date: new Date(entry.date),
    }));
  }

  return {
    version: 1,
    journalEntriesByYear: entriesByYear,
    fiscalYear: data.fiscalYear as number,
    startMonth: data.startMonth as number,
  };
};
