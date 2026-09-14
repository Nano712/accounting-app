import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AccountCombobox } from "@/components/CommandManyItems";
import { DateInput } from "@/components/DateInput";
import { AmountInput } from "@/components/ui/AmountInput";
import { useJournalForm } from "@/hooks/useJournalForm";


export const Journal=() => {


  const {
    date, setDate,
    dateError,setDateError,
    debitAccount, setDebitAccount,
    debitSubAccount, setDebitSubAccount,
    debitAmount, setDebitAmount,
    creditAccount, setCreditAccount,
    creditSubAccount, setCreditSubAccount,
    creditAmount, setCreditAmount,
    description, setDescription,
    handleSave,
  } = useJournalForm()






  
    return(
        <>
        <div className="grid grid-cols-7 gap-2  p-2  bg-gray-300" >
  <Label>日付</Label>
  <Label>借方科目</Label>
  <Label>借方金額</Label>
  <Label>貸方科目</Label>
  <Label>貸方金額</Label>
  <Label className="col-span-2" >摘要</Label>

  <Label>仕訳No.</Label>
  <Label>借方補助</Label>
  <Label>消費税額</Label>
  <Label>貸方補助</Label>
  <Label>消費税額</Label>
  <Label className="col-span-2" onClick={handleSave}>保存ボタン(仮)</Label>
</div>

<div className="grid grid-cols-7 gap-1 p-2 ">
  <DateInput value={date} onValueChange={setDate} isError={dateError} onErrorChange={setDateError}/> 
 <AccountCombobox
      value={debitAccount?.code}
      onValueChange={setDebitAccount} />
  <AmountInput className="rounded-none" 
  value={debitAmount === 0?"":debitAmount} onChange={(e) => setDebitAmount(Number(e.target.value))}/>
  <AccountCombobox
      value={creditAccount?.code} onValueChange={setCreditAccount} />
      <AmountInput className="rounded-none" 
      value={creditAmount === 0?"":creditAmount} onChange={(e) => setCreditAmount(Number(e.target.value))}/>
      <Input className="col-span-2 rounded-none" 
      value={description} onChange={(e) => setDescription(e.target.value)}/>

      <Input readOnly className="rounded-none"/>
      <Input className="rounded-none" 
      value={debitSubAccount} onChange={(e) => setDebitSubAccount(e.target.value)}/>
      <AmountInput className="rounded-none" readOnly/>
      <Input className="rounded-none"
      value={creditSubAccount} onChange={(e) => setCreditSubAccount(e.target.value)}/>
      <AmountInput className="rounded-none" readOnly/>
      <Input className="col-span-2 rounded-none"/>
      </div>

      

        </>
    )};
