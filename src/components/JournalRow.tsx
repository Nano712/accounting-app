import type { FormRow } from "@/hooks/useJournalForm"
import { DateInput } from "./DateInput"
import { AccountCombobox } from "./CommandManyItems"
import { AmountInput } from "./ui/AmountInput"
import { Input } from "./ui/input"
import type { JournalFormState } from "@/data/JournalFormState "


type JournalRowProps = {
  isFirstRow: boolean
  index: number
  row: FormRow               
  onUpdate: (updated: Partial<FormRow>) => void
  formState: JournalFormState
  id?:number
}

export const JournalRow = ({ isFirstRow, row, onUpdate, formState , id }: JournalRowProps) => {
  const { date, setDate, dateError, setDateError, description, setDescription } = formState

  return(
    <>
<div className="grid grid-cols-7 mt-2 px-1 max-w-5xl">
  {isFirstRow ? (<DateInput key={id ?? "new"} value={date} onValueChange={setDate} isError={dateError} onErrorChange={setDateError} /> ) 
  : (<Input className="rounded-none" readOnly />)}
  
 <AccountCombobox
      value={row.debitAccount?.code}
  onValueChange={(account) => onUpdate({ debitAccount: account })}
  showPlaceholder={isFirstRow}
  clearable
  showChevron={false}
  className="rounded-none"
/>

  <AmountInput className="rounded-none" 
  value={row.debitAmount === 0 ? "" : row.debitAmount} onChange={(e) => onUpdate({ debitAmount: Number(e.target.value) })}/>

     <AccountCombobox
  showPlaceholder={isFirstRow}
  clearable
  showChevron={false}
  className="rounded-none"
/>

      <AmountInput className="rounded-none" 
      value={row.creditAmount === 0 ? "" : row.creditAmount} onChange={(e) => onUpdate({ creditAmount: Number(e.target.value) })}/>

    {isFirstRow ? (<Input className="col-span-2 rounded-none" 
      value={description} onChange={(e) => setDescription(e.target.value)}/> ) 
  : (<Input readOnly className="col-span-2 rounded-none"/>)}

      {isFirstRow ? (<Input readOnly value={id ? id : "" } className="text-right rounded-none"/>):(<Input className="rounded-none" readOnly />)}

      <Input className="rounded-none" 
      value={row.debitSubAccount}
      onChange={(e) => onUpdate({ creditAmount: Number(e.target.value) })}
      />

      <AmountInput className="rounded-none" readOnly/>

      <Input className="rounded-none"
       value={row.creditSubAccount} 
       onChange={(e) => onUpdate({ creditSubAccount: e.target.value })}/>
      <AmountInput className="rounded-none" readOnly/>
      <Input className="col-span-2 rounded-none"/>
      </div>

      

        </>

  )
}