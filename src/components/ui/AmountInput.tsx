import { Input } from "@/components/ui/input"
import { cn } from "cn"

export function AmountInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      type="number"
      className={cn(
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        className
      )}
      {...props}
    />
  )
}