import select from '@inquirer/select'
import input from '@inquirer/input'
import { testCrowdfundingDeploy, testIGetNotesContract } from './handlers'
import { setupNode, setupSandbox } from './utils'
import { PXE } from '@aztec/aztec.js'
import { Logger } from '@/lib/Logger'

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

  },
  [CliAction.CAST_VOTE]: async (pxe: PXE) => {
    //TODO: Cast Vote handler
  },
  [CliAction.GET_VOTE]: async (pxe: PXE) => {
    //TODO: Get vote handler
  },
  [CliAction.END_VOTE]: async (pxe: PXE) => {
    // end vote handler
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
