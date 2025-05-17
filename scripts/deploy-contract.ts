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

const CONTRACT_ADDRESS_SALT = Fr.fromString('11')

export const deployVotingContract = async (pxe: PXE) => {
  console.log('START')
  const wallets = await getInitialTestAccountsWallets(pxe)
  const ownerWallet = wallets[0]

  // This will be removed for testnet as we will already have some ERC20 token there.

  const otherWallet = wallets[1]
  const thirdWallet = wallets[2]

  console.log(chalk.yellowBright('Owner wallet address', ownerWallet.getAddress().toString()))

  const deployTx = await EasyPrivateVotingContract.deploy(ownerWallet, ownerWallet.getAddress())
    .send()
    .deployed()


  // // Deploy contract with specific SALT
  //   const deployTx = await EasyPrivateVotingContract.deploy(ownerWallet, ownerWallet.getAddress())
  // .send({ contractAddressSalt: CONTRACT_ADDRESS_SALT, universalDeploy: false })
  // .deployed()

  // console.log(
  //   chalk.greenBright(`Contract deployed successfully \n TXN HASH: ${deployTx.txHash.toString()}`)
  // )
  console.log(
    chalk.greenBright(
      `Contract deployed successfully \n Contract Address: ${deployTx.instance.address.toString()}`
    )
  )

  // const contractInstance = await getContractInstanceFromDeployParams(
  //   EasyPrivateVotingContract.artifact,
  //   {
  //     salt: CONTRACT_ADDRESS_SALT,
  //     constructorArgs: [ownerWallet.getAddress()],
  //     deployer: ownerWallet.getAddress(),
  //   }
  // )
  // console.log('Contract instance address', contractInstance.address.toString())

  // const registrationTxReceipt = await registerContractClass(
  //   ownerWallet,
  //   EasyPrivateVotingContract.artifact
  // ).then((c) => c.send().wait())
  // const logs = await aztecNode.getContractClassLogs({ txHash: registrationTxReceipt.txHash })
  // console.log('registration receipt txn hash', registrationTxReceipt.txHash)
  // console.log('Logs', logs)
}

async function main() {
  const pxe = await setupSandbox()
  await deployVotingContract(pxe)
}

main().catch((error) => {
  console.error(chalk.red(error))
  process.exit(1)
})
