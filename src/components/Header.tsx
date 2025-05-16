'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { AztecWalletSdk, obsidion } from '@nemi-fi/wallet-sdk'
import { useAccount } from '@nemi-fi/wallet-sdk/react'
import { OBSIDION_WALLET_URL, TESTNET_NODE_URL } from '@/constants'
import { Button } from './ui/button'
import WalletMenu from './wallet/WalletMenu'
import { AzguardRpcClient } from '@azguardwallet/types'

const buildConnectionParams = () => {
  return {
    dappMetadata: {
      name: 'Aztec Starter',
      description:
        'A modern Next.js starter template with Aztec integration for building web3 applications',
      logo: 'https://somestaffspace.fra1.digitaloceanspaces.com/logo.png',
      url: 'https://azguardwallet.io/',
    },

    requiredPermissions: [
      {
        chains: ['aztec:11155111'],
        methods: [
          'register_contract',
          'send_transaction',
          'call',
          'simulate_utility',
          'add_capsule',
        ],
        events: [],
      },
    ],
  }
}

export const sdk = new AztecWalletSdk({
  aztecNode: TESTNET_NODE_URL,
  connectors: [obsidion({ walletUrl: OBSIDION_WALLET_URL })],
})

export const Header = () => {
  const [isConnecting, setIsConnecting] = useState(false)
  const account = useAccount(sdk)
  const accountAddress = account?.address?.toString() || ''

  const [azguardAccount, setAzguardAccount] = useState('')
  const [azguardAddress, setAzguardAddress] = useState<string | undefined>('')
  const [azguardSessionId, setAzguardSessionId] = useState('')
  const [azguardClient, setAzguardClient] = useState<AzguardRpcClient | null>(null)

  const handleConnectObsidion = async () => {
    try {
      setIsConnecting(true)
      await sdk.connect('obsidion')
    } catch (error) {
      console.error('Failed to Connect to Obsidion wallet', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleConnectAzguard = async () => {
    try {
      if (window.azguard) {
        const azguard = window.azguard.createClient() as AzguardRpcClient
        setAzguardClient(azguard)

        const sessionValue = await azguard.request('connect', buildConnectionParams())
        if (sessionValue?.id) {
          setAzguardSessionId(sessionValue.id)
          const accounts = sessionValue?.accounts || []
          setAzguardAccount(accounts[0])
          const address = accounts[0].split(':').at(-1)
          setAzguardAddress(address)
        }
      }
    } catch (err) {
      console.log('ERROR CONNECTION AZGUARD', err)
    }
  }

  console.log('azguardAddress', azguardAddress)

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

        {azguardAddress ? (
          <WalletMenu
            accountAddress={azguardAddress || ''}
            handleDisconnect={handleDisconnect}
          />
        ) : (
          <Button
            onClick={handleConnectAzguard}
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
