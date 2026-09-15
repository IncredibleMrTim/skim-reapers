export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 leading-none ${className}`}
    >
      <span className="flex items-baseline gap-[0.12em] text-[1.5em] font-bold tracking-tight uppercase">
        <span className="text-white">Skim</span>
        <span
          aria-hidden
          className="inline-block h-[0.85em] w-[0.2em] -skew-x-[18deg] bg-brand-primary"
        />
        <span className="text-brand-primary">Reapers</span>
      </span>
      <span className="self-end pb-[0.15em] text-[0.4em] font-semibold tracking-[0.2em] text-brand-secondary-foreground">
        Ltd
      </span>
    </span>
  )
}
