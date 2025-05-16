'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { AztecWalletSdk, obsidion } from '@nemi-fi/wallet-sdk'
import { useAccount } from '@nemi-fi/wallet-sdk/react'
import { OBSIDION_WALLET_URL, TESTNET_NODE_URL } from '@/constants'
import { Button } from './ui/button'
import WalletMenu from './wallet/WalletMenu'

export const sdk = new AztecWalletSdk({
  aztecNode: TESTNET_NODE_URL,
  connectors: [obsidion({ walletUrl: OBSIDION_WALLET_URL })],
})

export const Header = () => {
  const [isConnecting, setIsConnecting] = useState(false)
  const account = useAccount(sdk)
  const accountAddress = account?.address?.toString() || ''

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      await sdk.connect('obsidion')
    } catch (error) {
      console.error('Failed to Connect to Obsidion wallet', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await sdk.disconnect()
    } catch (error) {
      console.error('Failed to Disconnect to Obsidion wallet', error)
    }
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <div>Aztec Starter</div>

        {accountAddress ? (
          <WalletMenu
            accountAddress={accountAddress}
            handleDisconnect={handleDisconnect}
          />
        ) : (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
          >
            <span className="relative z-10 flex items-center">
              {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect Wallet
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}
