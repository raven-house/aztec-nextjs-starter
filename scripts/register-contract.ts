import { getInitialTestAccountsWallets } from '@aztec/accounts/testing'
import {
  Contract,
  PXE,
  registerContractClass,
} from '@aztec/aztec.js'
import chalk from 'chalk'

const PXE_URL = 'http://localhost:8080'
// const aztecNode = createAztecNodeClient(PXE_URL)

export const registerContract = async (pxe: PXE, contract: Contract) => {
  console.log('START')
  const wallets = await getInitialTestAccountsWallets(pxe)
  const ownerWallet = wallets[0]

  console.log(chalk.yellowBright('Owner wallet address', ownerWallet.getAddress().toString()))

  const registrationTxReceipt = await registerContractClass(
    ownerWallet,
    contract.artifact
  ).then((c) => c.send().wait())
  console.log('registration receipt txn hash', registrationTxReceipt.txHash.toString())
  // console.log('Logs', logs)
}
