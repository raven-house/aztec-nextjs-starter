import {
  AccountWalletWithSecretKey,
  createPXEClient,
  PXE,
  waitForPXE,
  createAztecNodeClient,
  AztecNode,
  Fr,
  AuthWitness,
  UniqueNote,
  AztecAddress,
} from '@aztec/aztec.js'
import { CrowdfundingContract } from '../src/artifacts/Crowdfunding'
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing'
import { TokenContract } from '@aztec/noir-contracts.js/Token'
import { decodeFromAbi, EventSelector } from '@aztec/stdlib/abi'

import { CrowdfundingDeployParams, DeployedContracts, TestWallets } from '@/types'
import { Logger } from '@/lib/Logger'
import chalk from 'chalk'
import input from '@inquirer/input'

export const PXE_URL = 'http://localhost:8080'

export const setupSandbox = async (): Promise<PXE> => {
  try {
    Logger.step(`Setting up sandbox with PXE URL: ${PXE_URL}`)
    const pxe = await createPXEClient(PXE_URL)
    await waitForPXE(pxe)
    Logger.success('PXE client created and connected successfully')
    return pxe
  } catch (error) {
    Logger.error('Failed to setup sandbox:', error)
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

const TOKEN_ID = 1

export const deployContracts = async (
  pxe: PXE,
  ownerWallet: AccountWalletWithSecretKey,
  config: CrowdfundingDeployParams
): Promise<DeployedContracts> => {
  try {
    Logger.step('Deploying RAVEN Token Contract')
    const tokenContract = await TokenContract.deploy(
      ownerWallet,
      ownerWallet.getAddress(),
      'RAVEN Token',
      'RAVEN',
      18
    )
      .send()
      .deployed()

    Logger.success('RAVEN Token Contract deployed at:', tokenContract.address.toString())

    Logger.step('Deploying NFT Collection Contract')
    const crowdfundingContract = await CrowdfundingContract.deploy(
      ownerWallet,
      tokenContract.address,
      config.admin,
      config.deadline
    )
      .send()
      .deployed()

    Logger.success('Crowdfunding Contract deployed at:', crowdfundingContract.address.toString())
    Logger.info('Contractconfig:', config)

    return { tokenContract, crowdfundingContract }
  } catch (error) {
    Logger.error('Failed to deploy contracts:', error)
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

// export const mintNFT = async (
//   nftContract: any,
//   minterWallet: AccountWalletWithSecretKey,
//   recipientAddress: any,
//   nonce: Fr = Fr.random()
// ): Promise<void> => {
//   try {
//     Logger.step(`Minting NFT to ${recipientAddress.toString().slice(0, 10)}...`)

//     const mintTx = await (await NFTContract.at(nftContract.address, minterWallet)).methods
//       .mint(recipientAddress, TOKEN_URI_PARTS_MOCK, nonce)
//       .send()
//       .wait()

//     Logger.success('NFT minted successfully')
//     Logger.info('Transaction status:', mintTx.status.toString())
//     Logger.info('Transaction hash:', mintTx.txHash.toString())
//   } catch (error) {
//     Logger.error('Failed to mint NFT:', error)
//     throw error
//   }
// }

export const getNFTsForWallet = async (
  nftContract: any,
  walletAddress: any,
  offset: number = 0
): Promise<any> => {
  try {
    const nfts = await nftContract.methods.get_public_nfts(walletAddress, offset).simulate()
    Logger.info('NFTs for wallet:', nfts)
    return nfts
  } catch (error) {
    Logger.error('Failed to get NFTs for wallet:', error)
    throw error
  }
}

export const createAuthWit = async (
  wallet: AccountWalletWithSecretKey,
  tokenContract: any,
  toAddress: any,
  amount: number,
  callerAddress: any,
  nonce?: Fr
): Promise<AuthWitness> => {
  try {
    const authNonce = nonce || Fr.random()
    Logger.step(`Creating AuthWit for token transfer: ${amount} tokens`)

    const action = tokenContract
      .withWallet(wallet)
      .methods.transfer_in_private(wallet.getAddress(), toAddress, amount, 0)

    const authwit = await wallet.createAuthWit({ caller: callerAddress, action })

    // await authWitInteraction.send().wait()
    Logger.success('AuthWit created successfully')

    return authwit
  } catch (error) {
    Logger.error('Failed to create AuthWit:', error)
    throw error
  }
}

export function processUniqueNote(uniqueNote: UniqueNote) {
  return {
    note: {
      owner: AztecAddress.fromField(uniqueNote.note.items[0]),
      randomness: uniqueNote.note.items[1],
      value: uniqueNote.note.items[2].toBigInt(),
    },
    contract_address: uniqueNote.contractAddress,
    metadata: {
      stage: 3,
      maybe_nonce: uniqueNote.nonce,
    },
  }
}

// export const createNFTListing = async (
//   nftContract: any,
//   sellerWallet: AccountWalletWithSecretKey,
//   tokenId: number,
//   price: number
// ): Promise<void> => {
//   try {
//     Logger.step(`Creating listing for token ${tokenId} at price ${price}`)

//     const listingTx = await (await NFTContract.at(nftContract.address, sellerWallet)).methods
//       .create_listing(tokenId, price)
//       .send()
//       .wait()

//     Logger.success('NFT listing created successfully')
//     Logger.info('Transaction hash:', listingTx.txHash.toString())
//   } catch (error) {
//     Logger.error('Failed to create NFT listing:', error)
//     throw error
//   }
// }

export const mintPublicTokensToWallet = async (
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

    Logger.success('Tokens publicly minted successfully. Tx hash:', mintTx.txHash.toString())
  } catch (error) {
    Logger.error('Failed to mint tokens:', error)
    throw error
  }
}

export const mintPrivateTokensToWallet = async (
  tokenContract: any,
  ownerWallet: AccountWalletWithSecretKey,
  recipientAddress: any,
  amount: number
): Promise<void> => {
  try {
    Logger.step(`Minting ${amount} tokens to wallet`)
    const mintTx = await (await TokenContract.at(tokenContract.address, ownerWallet)).methods
      .mint_to_private(ownerWallet.getAddress(), recipientAddress, amount)
      .send()
      .wait()

    Logger.success('Tokens privately minted successfully. Tx hash:', mintTx.txHash.toString())
  } catch (error) {
    Logger.error('Failed to mint tokens:', error)
    throw error
  }
}

export const checkTokenPrivateBalance = async (
  tokenContract: any,
  walletAddress: any,
  walletName: string = 'Wallet'
): Promise<bigint> => {
  try {
    const balance = await tokenContract.methods.balance_of_private(walletAddress).simulate()
    Logger.info(`${walletName} private balance:`, balance.toString())
    return balance
  } catch (error) {
    Logger.error(`Failed to check balance for ${walletName}:`, error)
    throw error
  }
}

const validateNumericInput = (input: string): boolean | string => {
  const number = parseInt(input)
  if (!input || !Number.isInteger(number)) {
    return 'Please enter a valid number'
  }
  return true
}

export const getNumericInput = async (message: string): Promise<number> => {
  const value = await input({
    message,
    validate: validateNumericInput,
  })
  return parseInt(value)
}
