import { getInitialTestAccountsWallets } from '@aztec/accounts/testing'
import { createPXEClient, PXE, waitForPXE } from '@aztec/aztec.js'
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

export const deployVotingContract = async (pxe: PXE) => {
  console.log('START')
  const wallets = await getInitialTestAccountsWallets(pxe)
  const ownerWallet = wallets[0]

  // This will be removed for testnet as we will already have some ERC20 token there.

  const otherWallet = wallets[1]
  const thirdWallet = wallets[2]

  console.log('Owner wallet', ownerWallet.getAddress().toString())
  const deployTx = await EasyPrivateVotingContract.deploy(ownerWallet, ownerWallet.getAddress())
    .send()
    .wait()

  console.log(
    chalk.greenBright(`Contract deployed successfully \n TXN HASH: ${deployTx.txHash.toString()}`)
  )
}

async function main() {
  const pxe = await setupSandbox()
  await deployVotingContract(pxe)
}

main().catch((error) => {
  console.error(chalk.red(error))
  process.exit(1)
})
