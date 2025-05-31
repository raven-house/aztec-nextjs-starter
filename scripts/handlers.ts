import { PXE } from '@aztec/aztec.js'
import {
  createAuthWit,
  deployContracts,
  getNumericInput,
  mintPrivateTokensToWallet,
  processUniqueNote,
  setupWallets,
} from './utils'
import { Logger } from '@/lib/Logger'
import chalk from 'chalk'

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
  await crowdfundingContract.withWallet(wallets.user2).methods.sync_notes().simulate()
  const notes = await pxe.getNotes({ txHash: donateTxn.txHash })
  const filteredNotes = notes.filter((x) => x.contractAddress.equals(crowdfundingContract.address))
  console.log(chalk.whiteBright('Filtered Notes', filteredNotes))
  if (filteredNotes.length > 0) {
    const uintNote = processUniqueNote(filteredNotes[0])
    console.log(uintNote)
  }
}
