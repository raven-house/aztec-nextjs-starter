'use client'
import { createContext, Dispatch, SetStateAction, useState } from 'react'

export type GlobalContextType = {
  walletName: 'obsidion' | 'azguard' | ''
  walletAddress: string
  setWalletName: Dispatch<SetStateAction<'' | 'obsidion' | 'azguard'>> | null
  setWalletAddress: Dispatch<SetStateAction<string>> | null
}

export const GlobalContext = createContext<GlobalContextType>({
  walletName: '',
  walletAddress: '',
  setWalletName: null,
  setWalletAddress: null,
})

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletName, setWalletName] = useState<'obsidion' | 'azguard' | ''>('')
  const [walletAddress, setWalletAddress] = useState('')

  return (
    <GlobalContext.Provider value={{ walletName, walletAddress, setWalletName, setWalletAddress }}>
      {children}
    </GlobalContext.Provider>
  )
}
