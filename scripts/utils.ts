import {
  AccountWalletWithSecretKey,
  createPXEClient,
  PXE,
  waitForPXE,
  createAztecNodeClient,
  AztecNode,
} from '@aztec/aztec.js'
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing'
import { TokenContract } from '@aztec/noir-contracts.js/Token'

import { TestWallets } from '@/types'
import { Logger } from '@/lib/Logger'

export const PXE_URL = 'http://localhost:8080'

export const setupPXE = async (): Promise<PXE> => {
  try {
    Logger.step(`Setting up PXE with PXE URL: ${PXE_URL}`)
    const pxe = await createPXEClient(PXE_URL)
    await waitForPXE(pxe)
    Logger.success('PXE client created and connected successfully')
    return pxe
  } catch (error) {
    Logger.error('Failed to setup PXE:', error)
    throw error
  }
}

export const setupNode = async (): Promise<AztecNode> => {
  try {
    Logger.step('Setting up Aztec node client')
    const aztecNode = await createAztecNodeClient(PXE_URL)
    Logger.success('Aztec node client created successfully')
    return aztecNode
  } catch (error) {
    Logger.error('Failed to setup node:', error)
    throw error
  }
}

export const setupWallets = async (pxe: PXE): Promise<TestWallets> => {
  try {
    Logger.step('Setting up test wallets')
    const wallets = await getInitialTestAccountsWallets(pxe)

    const testWallets: TestWallets = {
      owner: wallets[0],
      user1: wallets[1],
      user2: wallets[2],
      user3: wallets[3] || wallets[0], // Fallback if not enough wallets
    }

    Logger.success('Test wallets configured')
    Logger.info('Owner address:', testWallets.owner.getAddress().toString())
    Logger.info('User1 address:', testWallets.user1.getAddress().toString())
    Logger.info('User2 address:', testWallets.user2.getAddress().toString())

    return testWallets
  } catch (error) {
    Logger.error('Failed to setup wallets:', error)
    throw error
  }
}

export const mintTokensToWallet = async (
  tokenContract: any,
  ownerWallet: AccountWalletWithSecretKey,
  recipientAddress: any,
  amount: number
): Promise<void> => {
  try {
    Logger.step(`Minting ${amount} tokens to wallet`)
    const mintTx = await (await TokenContract.at(tokenContract.address, ownerWallet)).methods
      .mint_to_public(recipientAddress, amount)
      .send()
      .wait()

    Logger.success('Tokens minted successfully. Tx hash:', mintTx.txHash.toString())
  } catch (error) {
    Logger.error('Failed to mint tokens:', error)
    throw error
  }
}


export const checkTokenPublicBalance = async (
  tokenContract: any,
  walletAddress: any,
  walletName: string = 'Wallet'
): Promise<bigint> => {
  try {
    const balance = await tokenContract.methods.balance_of_public(walletAddress).simulate()
    Logger.info(`${walletName} public balance:`, balance.toString())
    return balance
  } catch (error) {
    Logger.error(`Failed to check balance for ${walletName}:`, error)
    throw error
  }
}
