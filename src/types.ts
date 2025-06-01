import { AccountWalletWithSecretKey, AztecAddress } from '@aztec/aztec.js'
import { CrowdfundingContract } from './artifacts/Crowdfunding'
import { TokenContract } from '@aztec/noir-contracts.js/Token'

export interface TestWallets {
  owner: AccountWalletWithSecretKey
  user1: AccountWalletWithSecretKey
  user2: AccountWalletWithSecretKey
  user3: AccountWalletWithSecretKey
}

export interface DeployedContracts {
  tokenContract: TokenContract
  crowdfundingContract: CrowdfundingContract
}

export interface CrowdfundingDeployParams {
  admin: AztecAddress
  deadline: number
}
