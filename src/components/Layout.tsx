import { NavLink, Outlet } from "react-router-dom";


export const Layout= ()=>{
    return(
    <div >
        <nav  className="flex gap-5 p-4">
                <NavLink to="/">ホーム</NavLink>
                <NavLink to="/journal">仕訳</NavLink>
                <NavLink to="/ledger">元帳</NavLink>
                <NavLink to="/trial-balance">試算表</NavLink>
                <NavLink to="/settings">設定</NavLink>
                
        </nav>
        <Outlet />
    </div>
)};