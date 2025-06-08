import { EasyPrivateVotingContract } from '@/artifacts/EasyPrivateVoting'
import { Fr, getContractInstanceFromDeployParams } from '@aztec/aztec.js'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CONTRACT_ADDRESS_SALT = Fr.fromString('13')
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


export const computeContractAddress = async (account: any) => {
  try {
    const contractInstance = await getContractInstanceFromDeployParams(
      EasyPrivateVotingContract.artifact,
      {
        salt: CONTRACT_ADDRESS_SALT,
        constructorArgs: [account.getAddress()],
        deployer: account.getAddress(),
      }
    )

    return contractInstance.address
  } catch (err) {
    console.error('Error computing contract address:', err)
    return null
  }
}
