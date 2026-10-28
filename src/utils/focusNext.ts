const FOCUSABLE = "input:not([readonly]):not([disabled]), button:not([disabled])"

export const focusNext = (from: HTMLElement) => {
  const form = from.closest<HTMLElement>("[data-journal-form]")
  if (!form) return

  const fields = Array.from(form.querySelectorAll<HTMLElement>(FOCUSABLE))
  const index = fields.indexOf(from)
  if (index === -1) return

  fields[index + 1]?.focus()
}