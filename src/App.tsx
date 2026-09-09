import { Router } from "./router/Router"
import './App.css'
import { Toaster } from "@/components/ui/sonner"

export const App = ()=> {

  return(
    <>
    <Router/>
    <Toaster position="top-right"/>
    </>
  
)
}

