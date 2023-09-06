import { CircleNotch } from "@phosphor-icons/react"
import { Header } from "./Header"

export function Loading() {
  return (
    <div className="h-screen-d">
      <Header />
      <div className="h-full flex items-center justify-center">
        <CircleNotch size={100} className="animate-spin text-black" />
      </div>
    </div>
  )
}
