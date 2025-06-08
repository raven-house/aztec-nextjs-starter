import select from '@inquirer/select'
import input from '@inquirer/input'
import { setupNode, setupPXE } from './utils'
import { PXE } from '@aztec/aztec.js'
import { Logger } from '@/lib/Logger'
import { castVoteHandler, deployVotingContract, endVoteHandler, getVoteHandler } from './voting_contract_handlers'

enum CliAction {
  DEPLOY_VOTING_CONTRACT = 'deploy_voting_contract',
  CAST_VOTE = 'cast_vote',
  GET_VOTE = 'get_vote',
  END_VOTE = 'end_vote',
  EXIT = 'exit'
}

interface ChoiceItem {
  name: string
  value: CliAction
  disabled?: boolean
}

const choices: ChoiceItem[] = [
  { name: 'Deploy Voting contract', value: CliAction.DEPLOY_VOTING_CONTRACT },
  { name: 'Cast Vote', value: CliAction.CAST_VOTE },
  { name: 'Get Vote', value: CliAction.GET_VOTE },
  { name: 'End Vote', value: CliAction.END_VOTE }
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

const handlers = {
  [CliAction.DEPLOY_VOTING_CONTRACT]: async (pxe: PXE) => {
    //TODO: Deploy voting contract handler
    await deployVotingContract(pxe)
  },
  [CliAction.CAST_VOTE]: async (pxe: PXE) => {
    //TODO: Cast Vote handler
    const candidateId = await getNumericInput("Enter candidate id you want to vote");
    const walletNo = await getNumericInput("Enter Wallet No");
    await castVoteHandler(pxe, candidateId, walletNo);
  },
  [CliAction.GET_VOTE]: async (pxe: PXE) => {
    //TODO: Get vote handler
    const candidateId = await getNumericInput("Enter candidate id you want fetch vote for");
    await getVoteHandler(pxe, candidateId);
  },
  [CliAction.END_VOTE]: async (pxe: PXE) => {
    // end vote handler
    const walletNo = await getNumericInput("Enter Wallet No");
    await endVoteHandler(pxe, walletNo)
  },
}

async function main() {
  try {
    const pxe = await setupPXE()
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
      }
    }
  } catch (error) {
    console.error('Script exited with error:', error)
    process.exit(1)
  }
}

main()
