import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check, MapPin, Clock } from 'lucide-react'
import { BRANCHES } from '../../lib/branches'

interface Props {
  value: string
  onChange: (id: string) => void
  showDetails?: boolean
}

export default function BranchSelect({ value, onChange, showDetails = false }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = BRANCHES.find((b) => b.id === value) ?? BRANCHES[0]

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref}>
      {/* Button + dropdown anchored together */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl border-2 border-paper-line bg-paper px-4 py-3 text-left text-sm font-semibold text-coal transition-colors hover:border-coal-dim focus:border-carrot focus:outline-none"
        >
          <span>{selected.name}</span>
          <ChevronDown
            size={15}
            className={`flex-shrink-0 text-coal-dim transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-paper-line bg-paper shadow-lift">
            {[...BRANCHES].sort((a, b) => a.name.localeCompare(b.name)).map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => { onChange(b.id); setOpen(false) }}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-paper-soft"
              >
                <span className={`font-semibold ${value === b.id ? 'text-carrot' : 'text-coal'}`}>
                  {b.name}
                </span>
                {value === b.id && <Check size={13} className="flex-shrink-0 text-carrot" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {showDetails && (
        <div className="mt-3 space-y-1.5">
          <div className="flex items-start gap-2 text-xs text-coal-muted">
            <MapPin size={12} className="mt-0.5 flex-shrink-0 text-coal-dim" />
            {selected.address}
          </div>
          <div className="flex items-start gap-2 text-xs text-coal-muted">
            <Clock size={12} className="mt-0.5 flex-shrink-0 text-coal-dim" />
            {selected.hours}
          </div>
        </div>
      )}
    </div>
  )
}
