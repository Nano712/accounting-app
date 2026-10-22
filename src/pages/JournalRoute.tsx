import { Navigate } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"
import { Journal } from "@/pages/Journal"

export const JournalRoute = () => {
  const isMobile = useIsMobile()
  if (isMobile === undefined) return null

  return isMobile ? <Navigate to="/journal/quick" replace /> : <Journal />
}