import { PXE } from '@aztec/aztec.js'
import {
  createAuthWit,
  deployContracts,
  getNumericInput,
  mintPrivateTokensToWallet,
  setupWallets,
} from './utils'
import { Logger } from '@/lib/Logger'

export const testCrowdfundingDeploy = async (pxe: PXE) => {
  const wallets = await setupWallets(pxe)
  const { tokenContract, crowdfundingContract } = await deployContracts(pxe, wallets.owner, {
    admin: wallets.owner.getAddress(),
    deadline: Date.now() + 360000,
  })
  Logger.success('Crowdfunding contract deployed successfully')

  const amountToDonate = await getNumericInput('Enter amounts to donate')
  console.log('amounts to donate', amountToDonate)
  Logger.info(`Mint ${amountToDonate + 100} to user 2`)
  await mintPrivateTokensToWallet(
    tokenContract,
    wallets.owner,
    wallets.user2.getAddress(),
    amountToDonate + 100
  )
  const authwit = await createAuthWit(
    wallets.user2,
    tokenContract,
    crowdfundingContract.address,
    amountToDonate,
    crowdfundingContract.address
  )

  const donateTxn = await crowdfundingContract
    .withWallet(wallets.user2)
    .methods.donate(amountToDonate)
    .send({ authWitnesses: [authwit] })
    .wait()
  Logger.success(`Donate txn hash`, donateTxn.txHash.toString())
}
