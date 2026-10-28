import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "cn"
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
import { focusNext } from "@/utils/focusNext"

const categoryGroups = [
  { label: "資産", items: assetAccounts },
  { label: "負債", items: liabilityAccounts },
  { label: "純資産", items: equityAccounts },
  { label: "収益", items: revenueAccounts },
  { label: "費用", items: expenseAccounts },
]

type AccountComboboxProps = {
  value?: string
  onValueChange: (account: AccountTitle | null) => void
  showPlaceholder?: boolean
  /** 選択済みのクリックで選択を解除する(仕訳入力用) */
  clearable?: boolean
  /** 右端に矢印を表示する(単体で使うとき) */
  showChevron?: boolean
  className?: string
}

export function AccountCombobox({
  value,
  onValueChange,
  showPlaceholder = true,
  clearable = false,
  showChevron = true,
  className,
}: AccountComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const selected = accountTitles.find((a) => a.code === value)

  const handleClick = () => {
    if (selected && clearable) {
      onValueChange(null)
    } else {
      setOpen(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
  if (e.key === "Enter" ) e.stopPropagation()
}

  return (
    <div className="@container h-8 w-full min-w-0">
      <Button
        ref={buttonRef}
        onKeyDown={handleKeyDown}
        type="button"
        variant="outline"
        onClick={handleClick}
        title={selected ? `${selected.code} - ${selected.name}` : undefined}
        className={cn(" w-full  justify-start cursor-pointer rounded-md", className)}
      >
        {selected ? (
          <>
            <span className="hidden @[100px]:inline">{selected.code} - </span>
            <span className="min-w-0 truncate">{selected.name}</span>
          </>
        ) : (
          showPlaceholder && (
            <span className="min-w-0 truncate text-muted-foreground">
              勘定科目を選択
            </span>
          )
        )}
        {showChevron && (
          <ChevronDown className="ml-auto size-4 shrink-0 opacity-50" />
        )}
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
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
                      setTimeout(() => {
                        if (buttonRef.current) focusNext(buttonRef.current)
                      }, 0)
                    }}
                  >
                    <span className="w-10 text-muted-foreground">
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