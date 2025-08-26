export const TESTNET_NODE_URL =
  process.env.NEXT_PUBLIC_TESTNET_NODE_URL || 'https://aztec-alpha-testnet-fullnode.zkv.xyz'

export const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE || 'TESTNET'

export const NODE_URL = APP_MODE === 'TESTNET' ? TESTNET_NODE_URL : 'http://localhost:8080'

export const OBSIDION_WALLET_URL = 'https://app.obsidion.xyz'
export const CHAIN_ID = APP_MODE === 'TESTNET' ? 11155111 : 31337

export const TIMEOUT = {
  LOW: 200_000,
  HIGH: 500_000,
}
