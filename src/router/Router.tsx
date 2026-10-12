import { Route,Routes } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Home } from "../pages/Home";
import { Journal } from "../pages/Journal";
import { JournalEdit } from "../pages/JournalEdit";
import { JournalList } from "@/pages/JournalList";
import { Ledger } from "../pages/Ledger";
import { TrialBalance } from "../pages/TrialBalance";
import { Settings } from "../pages/Settings";
import { Page404 } from "../pages/Page404";
import { Debug } from "@/pages/Debug";
import { BalanceSheet } from "@/pages/BalanceSheet";
import { IncomeStatement } from "@/pages/IncomeStatement";



export const Router =()=> {
return (
    <Routes>
        <Route element={<Layout />}>
            <Route path="/" element={<Home/>} />

        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/edit/:id" element={<JournalEdit/>} />
        
        <Route path="/journal/list" element={<JournalList/>}/>
        <Route path="/ledger" element={<Ledger/>} />
        <Route path="/trial-balance" element={<TrialBalance/>} />
        <Route path="/pl" element={<IncomeStatement/>} />
        <Route path="/bs" element={<BalanceSheet/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/debug" element={<Debug/>} />

        </Route>
        <Route path="*" element={<Page404 />} />
    </Routes >
)
};