import { getInitialTestAccountsWallets } from '@aztec/accounts/testing'
import {
  createAztecNodeClient,
  createPXEClient,
  Fr,
  getContractInstanceFromDeployParams,
  PXE,
  registerContractClass,
  waitForPXE,
} from '@aztec/aztec.js'
import { EasyPrivateVotingContract } from '../src/artifacts/EasyPrivateVoting'
import chalk from 'chalk'

const PXE_URL = 'http://localhost:8080'

export const setupSandbox = async () => {
  console.log('Setup sandbox start with PXE URL', PXE_URL)
  const pxe = await createPXEClient(PXE_URL)
  await waitForPXE(pxe)
  console.log('PXE created successfully')
  return pxe
}

// const aztecNode = createAztecNodeClient(PXE_URL)

export const registerVotingContract = async (pxe: PXE) => {
  console.log('START')
  const wallets = await getInitialTestAccountsWallets(pxe)
  const ownerWallet = wallets[0]

  console.log(chalk.yellowBright('Owner wallet address', ownerWallet.getAddress().toString()))

  const registrationTxReceipt = await registerContractClass(
    ownerWallet,
    EasyPrivateVotingContract.artifact
  ).then((c) => c.send().wait())
  // const logs = await aztecNode.getContractClassLogs({ txHash: registrationTxReceipt.txHash })
  console.log('registration receipt txn hash', registrationTxReceipt.txHash.toString())
  // console.log('Logs', logs)
}

async function main() {
  const pxe = await setupSandbox()
  try {
    await registerVotingContract(pxe)
  } catch (error: any) {
    if (error.toString().toLowerCase().includes('existing nullifier')) {
      console.log(chalk.yellow('Contract already registered'))
    }
  }
}

main().catch((error) => {
  console.error(chalk.red(error))
  process.exit(1)
})
