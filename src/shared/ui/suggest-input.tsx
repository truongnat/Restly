import { useRef, useState } from 'react'

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
  const containerRef = useRef<HTMLDivElement>(null)

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
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 150)
        }}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />
      {showDropdown && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-md">
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
        </div>
      )}
    </div>
  )
}
