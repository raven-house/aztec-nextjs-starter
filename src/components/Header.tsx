'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { AztecWalletSdk, obsidion } from '@nemi-fi/wallet-sdk'
import { useAccount } from '@nemi-fi/wallet-sdk/react'
import { OBSIDION_WALLET_URL, TESTNET_NODE_URL } from '@/constants'
import { Button } from './ui/button'
import WalletMenu from './wallet/WalletMenu'
import { AzguardRpcClient, DappPermissions, DappMetadata } from '@azguardwallet/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

type BuildConnectionParamsType = {
  dappMetadata: DappMetadata
  requiredPermissions: DappPermissions[]
}

const buildConnectionParams = (): BuildConnectionParamsType => {
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
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false)
  const obsidionAccount = useAccount(sdk)
  const obsidionAddress = obsidionAccount?.address?.toString() || ''

  const [azguardAccount, setAzguardAccount] = useState('')
  const [azguardAddress, setAzguardAddress] = useState<string | undefined>('')
  const [azguardSessionId, setAzguardSessionId] = useState('')
  const [azguardClient, setAzguardClient] = useState<AzguardRpcClient | null>(null)

  const handleConnectObsidion = async () => {
    try {
      setIsConnecting(true)
      setIsWalletDialogOpen(false)
      await sdk.connect('obsidion')
    } catch (error) {
      console.error('Failed to Connect to Obsidion wallet', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleConnectAzguard = async () => {
    try {
      setIsConnecting(true)
      setIsWalletDialogOpen(false)
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
    } finally {
      setIsConnecting(false)
    }
  }
  console.log('azguardAddress', azguardAddress)

  const handleDisconnect = async () => {
    try {
      await sdk.disconnect()
      setAzguardAddress(undefined)
      setAzguardAccount('')
      setAzguardSessionId('')
      setAzguardClient(null)
    } catch (error) {
      console.error('Failed to Disconnect wallet', error)
    }
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <div>Aztec Starter</div>

        {azguardAddress || obsidionAddress ? (
          <WalletMenu
            accountAddress={azguardAddress || obsidionAddress}
            handleDisconnect={handleDisconnect}
          />
        ) : (
          <>
            <Button
              onClick={() => setIsWalletDialogOpen(true)}
              disabled={isConnecting}
            >
              <span className="relative z-10 flex items-center">
                {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Connect Wallet
              </span>
            </Button>

            <Dialog
              open={isWalletDialogOpen}
              onOpenChange={setIsWalletDialogOpen}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Connect Wallet</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <Button
                    onClick={handleConnectAzguard}
                    className="w-full justify-start"
                    disabled={isConnecting}
                  >
                    <img
                      src="assets/azguard-logo.png"
                      alt="Azguard"
                      className="mr-2 h-5 w-5"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    Azguard
                  </Button>
                  <Button
                    onClick={handleConnectObsidion}
                    className="w-full justify-start"
                    disabled={isConnecting}
                  >
                    <img
                      src="assets/obsidion-logo.svg"
                      alt="Obsidion"
                      className="mr-2 h-5 w-5"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    Obsidion
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  )
}
