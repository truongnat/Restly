import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { EnvAwareInput } from '@/shared/ui/env-aware-input'

export interface SuggestInputProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function SuggestInput({
  value,
  onChange,
  options,
  placeholder,
  className,
  disabled,
}: SuggestInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 160),
      })
    }
  }

  useEffect(() => {
    if (isOpen) {
      updateCoords()
      window.addEventListener('resize', updateCoords)
      window.addEventListener('scroll', updateCoords, true)
      return () => {
        window.removeEventListener('resize', updateCoords)
        window.removeEventListener('scroll', updateCoords, true)
      }
    }
  }, [isOpen])

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes((value || '').toLowerCase()),
  )

  const showDropdown = isOpen && filteredOptions.length > 0

  return (
    <div ref={containerRef} className="relative w-full">
      <EnvAwareInput
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => {
          updateCoords()
          setIsOpen(true)
        }}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 150)
        }}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />
      {showDropdown &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 9999,
            }}
            className="max-h-48 overflow-y-auto rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-md"
          >
            {filteredOptions.map((opt) => (
              <div
                key={opt}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onChange(opt)
                  setIsOpen(false)
                }}
                className="cursor-pointer px-2.5 py-1.5 font-mono text-xs hover:bg-accent hover:text-accent-foreground"
              >
                {opt}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}
