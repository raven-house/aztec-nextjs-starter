'use client'
import { createContext, Dispatch, SetStateAction, useState } from 'react'
import { type AzguardRpcClient } from '@azguardwallet/types'

export type GlobalContextType = {
  walletName: 'obsidion' | 'azguard' | ''
  walletAddress: string
  setWalletName: Dispatch<SetStateAction<'' | 'obsidion' | 'azguard'>> | null
  setWalletAddress: Dispatch<SetStateAction<string>> | null
  azguardAccount: string
  setAzguardAccount: Dispatch<SetStateAction<string>> | null
  azguardSessionId: string
  setAzguardSessionId: Dispatch<SetStateAction<string>> | null
  azguardClient: AzguardRpcClient | null
  setAzguardClient: Dispatch<SetStateAction<AzguardRpcClient | null>> | null
}

export const GlobalContext = createContext<GlobalContextType>({
  walletName: '',
  walletAddress: '',
  setWalletName: null,
  setWalletAddress: null,
  azguardAccount: '',
  setAzguardAccount: null,
  azguardSessionId: '',
  setAzguardSessionId: null,
  azguardClient: null,
  setAzguardClient: null,
})

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletName, setWalletName] = useState<'obsidion' | 'azguard' | ''>('')
  const [walletAddress, setWalletAddress] = useState('')
  const [azguardAccount, setAzguardAccount] = useState('')
  const [azguardSessionId, setAzguardSessionId] = useState('')
  const [azguardClient, setAzguardClient] = useState<AzguardRpcClient | null>(null)

  return (
    <GlobalContext.Provider
      value={{
        walletName,
        walletAddress,
        setWalletName,
        setWalletAddress,
        azguardAccount,
        setAzguardAccount,
        azguardSessionId,
        setAzguardSessionId,
        azguardClient,
        setAzguardClient,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
