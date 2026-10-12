import { NavLink, Outlet, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useYearStore } from "@/store/useYearStore"

const navItems = [
  { to: "/", label: "ホーム" },
  { to: "/journal", label: "仕訳" },
  { to: "/journal/list", label: "仕訳日記帳" },
  { to: "/ledger", label: "元帳" },
  { to: "/trial-balance", label: "試算表" },
  { to: "/pl", label: "損益計算書（P/L）" },
  { to: "/bs", label: "貸借対照表（B/S）" },
  { to: "/settings", label: "設定" },
  { to: "/debug", label: "デバッグ" },
]



const availableYears = [
  2025,
  2026,
  2027,
  2028,
  2029,
]


export const Layout = () => {
  const location = useLocation()

  const fiscalYear = useYearStore((state)=>state.fiscalYear);
  const setFiscalYear = useYearStore((state)=>state.setFiscalYear);
  const startMonth = useYearStore((state)=>state.startMonth);

  const endYear = startMonth === 1 ? fiscalYear : fiscalYear + 1
const endMonth = startMonth === 1 ? 12 : startMonth - 1

  return (

    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton render={<NavLink to={item.to} />} isActive={location.pathname === item.to} >
                {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex items-center gap-4 border-b p-2">
          <SidebarTrigger className="cursor-pointer"/>
          

<Select value={String(fiscalYear)} onValueChange={(value) => setFiscalYear(Number(value))}>
  <SelectTrigger className="w-28 cursor-pointer">
    <SelectValue>{fiscalYear}年度</SelectValue>
  </SelectTrigger>
  <SelectContent>
    {availableYears.map((year) => (
      <SelectItem key={year} value={String(year)} className={"cursor-pointer"}>
        {year}年度
      </SelectItem>
    ))}
  </SelectContent>
</Select>
<span>会計期間：{fiscalYear}年{startMonth}月 ～ {endYear}年{endMonth}月</span>


        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}