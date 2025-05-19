import { Fr } from '@aztec/foundation/fields'
import { AztecAddress } from '@aztec/stdlib/aztec-address'
import { DEPLOYER_CONTRACT_ADDRESS } from '@aztec/constants'
import { getContractInstanceFromDeployParams } from '@aztec/stdlib/contract'
import { PublicKeys } from '@aztec/stdlib/keys'
import {
  EasyPrivateVotingContractArtifact,
  EasyPrivateVotingContract,
} from '@/artifacts/EasyPrivateVoting'

type ContractCtorArgs = Parameters<EasyPrivateVotingContract['methods']['constructor']>

const instanceDeployer = AztecAddress.fromNumber(DEPLOYER_CONTRACT_ADDRESS)

const getChain = (account: string) => account?.substring(0, account.lastIndexOf(':'))

export const getDeployContractBatchCallsForAlreadyRegistered = async ({
  account,
  address,
  sessionId,
}: {
  account: any
  address: string
  sessionId: string
}) => {
  const chain = getChain(account)
  const artifact = EasyPrivateVotingContractArtifact
  const constructorArgs: ContractCtorArgs = [AztecAddress.fromString(address)]
  const instance = await getContractInstanceFromDeployParams(artifact, {
    constructorArgs,
    publicKeys: PublicKeys.default(),
    salt: Fr.zero(),
  })
  const { salt, currentContractClassId, initializationHash, publicKeys } = instance

  console.log('currentContractClassId', currentContractClassId.toString())
  const operations = [
    {
      // here we register the contract in PXE, so PXE can interact with it
      kind: 'register_contract',
      chain,
      address: instance.address,
      instance,
      artifact,
    },
    {
      kind: 'send_transaction',
      account,
      actions: [
        {
          // here we publicly deploy the contract instance
          kind: 'call',
          contract: instanceDeployer,
          method: 'deploy',
          args: [salt, currentContractClassId, initializationHash, publicKeys.toNoirStruct(), true],
        },
        {
          // here we initialize the contract
          kind: 'call',
          contract: instance.address,
          method: 'constructor',
          args: constructorArgs,
        },
      ],
    },
  ]

  return { sessionId, operations }
}
