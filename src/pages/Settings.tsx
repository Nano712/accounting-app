import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useYearStore } from "@/store/useYearStore"
import { useState } from "react";
import { toast } from "sonner";

export const Settings=() => {
    const setStartMonth = useYearStore((state)=>state.setStartMonth);
  const startMonth = useYearStore((state)=>state.startMonth);

   const [inputMonth, setInputMonth] = useState(startMonth)
  
    return(
        <>
        <h2>設定</h2>
        <div className="mt-4">
            <h3>基本設定</h3>
            <div className="flex">
                <label className="ml-4">会計年度</label>
                <Input className="w-32"/>
                <Button>保存</Button>
            </div>
            <div className="flex">
                <label className="ml-4">期首月</label>
                <Input value={inputMonth} onChange={(e) => setInputMonth(Number(e.target.value))} type="number" min={1} max={12} className="w-32"/>
                <Button onClick={()=>{if (inputMonth < 1 || inputMonth > 12) {
      toast.error("月は、1から12の間で、入力してください",{
  className: "!bg-red-500 !text-white",})
      return
    }setStartMonth(Number(inputMonth))}}>保存</Button>
            </div>
        </div>
        <div className="mt-4">
            <h3>事業者情報</h3>
            <div className="flex">
                <label className="ml-4">屋号</label>
                <Input className="w-32"/>
                <Button>保存</Button>
            </div>
            <div className="flex">
                <label className="ml-4">氏名</label>
                <Input className="w-32"/>
                <Button>保存</Button>
            </div>
            <div className="flex">
                <label className="ml-4">住所</label>
                <Input className="w-32"/>
                <Button>保存</Button>
            </div>
        </div>

        <div className="mt-4">
            <h3>会計設定</h3>
                <label className="ml-4">勘定科目</label>

                <label className="ml-4">税区分</label>

        </div>
        
        </>
    )};