import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: string | null, startChars = 6, endChars = 4): string {
  if (!address) return ''

  const parts = address.split(':')
  const addr = parts[parts.length - 1]

  if (addr.length <= startChars + endChars) return addr

  return `${addr.substring(0, startChars)}...${addr.substring(addr.length - endChars)}`
}

export const validateAddress = (address: string) => {
  if (!address.startsWith('0x')) return 'Address must start with 0x'
  return ''
}
