import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  assetAccounts,
  liabilityAccounts,
  equityAccounts,
  revenueAccounts,
  expenseAccounts,
  accountTitles,
} from "@/data/AccountTitle"
import type { AccountTitle } from "@/data/AccountTitle"


const categoryGroups = [
  { label: "資産", items: assetAccounts },
  { label: "負債", items: liabilityAccounts },
  { label: "純資産", items: equityAccounts },
  { label: "収益", items: revenueAccounts },
  { label: "費用", items: expenseAccounts },
]

type AccountComboboxProps = {
  value?: string
  onValueChange: (account: AccountTitle) => void
}

export function AccountCombobox({ value, onValueChange }: AccountComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const selected = accountTitles.find((a) => a.code === value)

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full justify-start rounded-none"
      >
        {selected ? `${selected.code} - ${selected.name}` : "勘定科目を選択"}
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} >
        <CommandInput placeholder="コードまたは科目名で検索..." />
        <CommandList>
          <CommandEmpty>該当する科目がありません</CommandEmpty>
          {categoryGroups.map((group, i) => (
            <React.Fragment key={group.label}>
              <CommandGroup heading={group.label}>
                {group.items.map((account) => (
                  <CommandItem
                    key={account.id}
                    value={`${account.code} ${account.name}`}
                    onSelect={() => {
                      onValueChange(account)
                      setOpen(false)
                    }}
                  >
                    <span className="text-muted-foreground w-10">
                      {account.code}
                    </span>
                    <span>{account.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {i < categoryGroups.length - 1 && <CommandSeparator />}
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  )
}