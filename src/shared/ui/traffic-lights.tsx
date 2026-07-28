import { cn } from '@/shared/lib/utils'

export function TrafficLights({ className }: { className?: string }) {
  return (
    <div className={cn('flex gap-2', className)}>
      <span className="size-3 rounded-full border border-[#E0443E] bg-[#FF5F56]" />
      <span className="size-3 rounded-full border border-[#DEA123] bg-[#FFBD2E]" />
      <span className="size-3 rounded-full border border-[#1AAB29] bg-[#27C93F]" />
    </div>
  )
}
