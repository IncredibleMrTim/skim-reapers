import { BeliefCard } from "./BeliefCard"
import { TbTargetArrow, TbUsers, TbPuzzle } from "react-icons/tb"
import { LuChartNoAxesCombined, LuHandshake } from "react-icons/lu"

export const BeliefBar = ({ className }: { className?: string }) => {
  return (
    <div className={`flex flex-flow justify-between px-8 py-4 h-20`}>
      <BeliefCard
        icon={<TbUsers size={48} strokeWidth={1} color="var(--accent)" />}
        text="ONE TEAM. ONE STANDARD"
      />
      <div className="h-full shrink-0 border-r border-brand-content/25" />
      <BeliefCard
        icon={<TbTargetArrow size={48} strokeWidth={1} color="var(--accent)" />}
        text="WE DONT CREATE PROBLEMS"
      />
      <div className="h-full shrink-0 border-r border-brand-content/25" />
      <BeliefCard
        icon={<TbPuzzle size={48} strokeWidth={1} color="var(--accent)" />}
        text="WE CREATE SOLUTIONS"
      />
      <div className="h-full shrink-0 border-r border-brand-content/25" />
      <BeliefCard
        icon={
          <LuChartNoAxesCombined
            size={48}
            strokeWidth={1}
            color="var(--accent)"
          />
        }
        text="QUALITY THAT SCALES"
      />
      <div className="h-full shrink-0 border-r border-brand-content/25" />
      <BeliefCard
        icon={<LuHandshake size={48} strokeWidth={1} color="var(--accent)" />}
        text="BUILT ON TRUST & RELIABILITY"
      />
    </div>
  )
}
