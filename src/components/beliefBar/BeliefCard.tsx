import { ReactNode } from "react"

interface IBeliefBar {
  icon: ReactNode
  text: string
}

export const BeliefCard = ({ icon, text }: IBeliefBar) => {
  return (
    <div className="flex w-1/5 px-8 gap-4 items-center justify-center">
      {icon}
      <div className="max-w-3/5">{text}</div>
    </div>
  )
}
