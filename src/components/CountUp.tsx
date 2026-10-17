import { useEffect, useRef, useState } from 'react'

type CountUpProps = {
  value: number
  className?: string
}

export function CountUp({ value, className }: CountUpProps) {
  const [display, setDisplay] = useState(value)
  const current = useRef(value)

  useEffect(() => {
    const from = current.current
    const to = value
    if (from === to) return

    const duration = 700
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      const next = Math.round(from + (to - from) * eased)
      current.current = next
      setDisplay(next)
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <span className={`tabular-nums ${className ?? ''}`}>
      {display.toLocaleString('en-US')}
    </span>
  )
}
