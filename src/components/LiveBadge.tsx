export function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-white/5 px-3 py-1">
      <span className="live-dot h-2.5 w-2.5 rounded-full bg-success" />
      <span className="text-xs font-semibold tracking-[0.18em] text-white">LIVE</span>
    </div>
  )
}
