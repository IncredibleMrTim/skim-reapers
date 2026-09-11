import { ReactNode } from "react"

interface IBeliefBar {
  icon: ReactNode
  text: string
}

export const BeliefCard = ({ icon, text }: IBeliefBar) => {
  return (
    <div className="flex flex-1 min-w-0 px-4 md:px-8 gap-4 items-center justify-center">
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">{text}</div>
    </div>
  )
}
