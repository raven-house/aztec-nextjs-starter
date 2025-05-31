import {
  PXE,
  AccountWalletWithSecretKey,
  createPXEClient,
  waitForPXE,
  type UniqueNote,
  AztecAddress,
} from '@aztec/aztec.js'
import { TokenContract } from '@aztec/noir-contracts.js/Token'
import { CrowdfundingContract } from '../src/artifacts/Crowdfunding'
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing'
import chalk from 'chalk'

const PXE_URL = 'http://localhost:8080'

export const setupPXE = async () => {
  console.log('Setup sandbox start with PXE URL', PXE_URL)
  const pxe = await createPXEClient(PXE_URL)
  await waitForPXE(pxe)
  console.log('PXE created successfully')
  return pxe
}

export const setupContracts = async (
  pxe: PXE,
  ownerWallet: AccountWalletWithSecretKey,
  options: {
    deadline: number
  }
) => {
  const tokenContract = await TokenContract.deploy(
    ownerWallet,
    ownerWallet.getAddress(),
    'RAVEN Token',
    'RAVEN',
    18
  )
    .send()
    .deployed()

  console.log('RAVEN ERC20 Token Contract Address', tokenContract.address)
  const crowdfundingContract = await CrowdfundingContract.deploy(
    ownerWallet,
    tokenContract.address,
    ownerWallet.getAddress(),
    options.deadline
  )
    .send()
    .deployed()
  console.log('Crowdfunding Contract deployed succesfully')
  console.log('Crowdfunding Contract Address', crowdfundingContract.address)
  return { tokenContract, crowdfundingContract }
}

async function main() {
  const pxe = await setupPXE()
  const [firstWallet, secondWallet, thirdWallet] = await getInitialTestAccountsWallets(pxe)

  const { tokenContract, crowdfundingContract } = await setupContracts(pxe, firstWallet, {
    deadline: 1757688354,
  })
  console.log(chalk.yellowBright('##### Mint RAVEN tokens privately to third wallet ######'))
  const mintTx1 = await tokenContract.methods
    .mint_to_private(firstWallet.getAddress(), thirdWallet.getAddress(), 100000000)
    .send()
    .wait()
  console.log(chalk.magenta.underline('mint token txn hash', mintTx1.txHash.toString()))
  let thirdWalletBalance = await tokenContract.methods
    .balance_of_private(thirdWallet.getAddress())
    .simulate()
  console.log(chalk.greenBright('Third wallet private balance: ', thirdWalletBalance))

  console.log(chalk.yellowBright('Third wallet donates 1000 RAVEN tokens'))

  const action = tokenContract
    .withWallet(thirdWallet)
    .methods.transfer_in_private(thirdWallet.getAddress(), crowdfundingContract.address, 1000, 0)
  const witness = await thirdWallet.createAuthWit({ caller: crowdfundingContract.address, action })
  const donateTxn = await crowdfundingContract
    .withWallet(thirdWallet)
    .methods.donate(1000)
    .send({ authWitnesses: [witness] })
    .wait()
  console.log(chalk.magenta.underline('donate token txn hash', donateTxn.txHash.toString()))
  thirdWalletBalance = await tokenContract.methods
    .balance_of_private(thirdWallet.getAddress())
    .simulate()
  console.log(chalk.greenBright('Third wallet updated private balance: ', thirdWalletBalance))
  await crowdfundingContract.withWallet(thirdWallet).methods.sync_notes().simulate()
  const notes = await pxe.getNotes({ txHash: donateTxn.txHash })
  const filteredNotes = notes.filter((x) => x.contractAddress.equals(crowdfundingContract.address))
  console.log(chalk.whiteBright('Filtered Notes', filteredNotes))
}

main().catch((error) => {
  console.error(chalk.red(error))
  process.exit(1)
})

function processUniqueNote(uniqueNote: UniqueNote) {
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
