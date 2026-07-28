import { COMMON_HTTP_HEADERS } from '@/shared/constants/http-headers'
import { SuggestInput, type SuggestInputProps } from '@/shared/ui/suggest-input'

export interface HttpKeyInputProps extends Omit<SuggestInputProps, 'options'> {
  options?: string[]
}

export function HttpKeyInput({ options = COMMON_HTTP_HEADERS, ...props }: HttpKeyInputProps) {
  return <SuggestInput options={options} {...props} />
}
