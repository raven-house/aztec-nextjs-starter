import select from '@inquirer/select'
import input from '@inquirer/input'
import { testCrowdfundingDeploy } from './handlers'
import { setupNode, setupSandbox } from './utils'
import { PXE } from '@aztec/aztec.js'

enum CliAction {
  DEPLOY_COLLECTION = 'deploy_collection',
  DEPLOY_FACTORY_CONTRACT = 'deploy_factory_contract',
  TRANSFER_NFT = 'transfer_nft',
  LOG_EVENTS = 'log_events',
  TEST_PUBLIC_FREE_MINT = 'test_public_free_mint',
  TEST_PUBLIC_PAID_MINT = 'test_public_paid_mint',
  TEST_BUY_SELL_NFT = 'test_buy_sell_nft',
  DEPLOY_ACCOUNT_TESTNET = 'deploy_account_testnet',
  DEPLOY_NFT_COLLECTION_TESTNET = 'deploy_nft_collection_testnet',
  LOG_PUBLIC_EVENTS_FROM_NODE = 'log_public_events_from_node',
  EXIT = 'exit',
}

interface ChoiceItem {
  name: string
  value: CliAction
  disabled?: boolean
}

const choices: ChoiceItem[] = [
  { name: 'Deploy Collection', value: CliAction.DEPLOY_COLLECTION },
  { name: 'Deploy Account Testnet', value: CliAction.DEPLOY_ACCOUNT_TESTNET },
  { name: 'Deploy NFT Collection Testnet', value: CliAction.DEPLOY_NFT_COLLECTION_TESTNET },
  { name: 'Deploy Factory Contract', value: CliAction.DEPLOY_FACTORY_CONTRACT },
  { name: 'Transfer NFT', value: CliAction.TRANSFER_NFT },
  { name: 'Log Events', value: CliAction.LOG_EVENTS },
  { name: 'Test Public Free Mint', value: CliAction.TEST_PUBLIC_FREE_MINT },
  { name: 'Test Public Paid Mint', value: CliAction.TEST_PUBLIC_PAID_MINT },
  { name: 'Test Buy/Sell NFT', value: CliAction.TEST_BUY_SELL_NFT },

  { name: 'Log Public Events From Node', value: CliAction.LOG_PUBLIC_EVENTS_FROM_NODE },
  { name: 'Exit', value: CliAction.EXIT },
]

const validateNumericInput = (input: string): boolean | string => {
  const number = parseInt(input)
  if (!input || !Number.isInteger(number)) {
    return 'Please enter a valid number'
  }
  return true
}

const getNumericInput = async (message: string): Promise<number> => {
  const value = await input({
    message,
    validate: validateNumericInput,
  })
  return parseInt(value)
}
// const getStringInput = async (message: string): Promise<string> => {
//   const value = await input({
//     message,
//   })
//   return value
// }

const handlers = {
  [CliAction.DEPLOY_COLLECTION]: async (pxe: PXE) => {
    console.log('deploying collection')
    await testCrowdfundingDeploy(pxe)
  },
  [CliAction.DEPLOY_ACCOUNT_TESTNET]: async (pxe: PXE) => {
    console.log('deploying account')
  },
  [CliAction.DEPLOY_NFT_COLLECTION_TESTNET]: async (pxe: PXE) => {
    console.log('deploying NFT COLLECTION')
  },
  [CliAction.TRANSFER_NFT]: async () => {
    console.log('transfer nft')
  },
  [CliAction.LOG_EVENTS]: async (pxe: PXE) => {},
  [CliAction.TEST_PUBLIC_FREE_MINT]: async (pxe: PXE) => {},
  [CliAction.TEST_PUBLIC_PAID_MINT]: async (pxe: PXE) => {},
  [CliAction.TEST_BUY_SELL_NFT]: async (pxe: PXE) => {},
  [CliAction.DEPLOY_FACTORY_CONTRACT]: async () => {
    console.log('deploying factory contract')
  },
  [CliAction.LOG_PUBLIC_EVENTS_FROM_NODE]: async () => {
    const aztecNode = await setupNode()
    const from = await getNumericInput('From Block')
    const limit = await getNumericInput('Limit')
  },
}

async function main() {
  try {
    const pxe = await setupSandbox()
    while (true) {
      const answer = await select<CliAction>({
        message: 'What would you like to do?',
        choices,
      })

      if (answer === CliAction.EXIT) {
        console.log('Exiting...')
        break
      }

      const handler = handlers[answer]
      if (handler) {
        await handler(pxe)
        break
      }
    }
  } catch (error) {
    console.error('Script exited with error:', error)
    process.exit(1)
  }
}

main()
