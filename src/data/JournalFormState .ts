import type { useJournalForm } from "@/hooks/useJournalForm";

export type JournalFormState = Pick<
  ReturnType<typeof useJournalForm>,
  "date" | "setDate" | "dateError" | "setDateError" | "description" | "setDescription"
>