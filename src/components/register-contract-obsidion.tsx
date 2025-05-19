import { Fr } from '@aztec/foundation/fields'
import { bufferAsFields } from '@aztec/stdlib/abi'
import { AztecAddress } from '@aztec/stdlib/aztec-address'
import {
  MAX_PACKED_PUBLIC_BYTECODE_SIZE_IN_FIELDS,
  REGISTERER_CONTRACT_ADDRESS,
  REGISTERER_CONTRACT_BYTECODE_CAPSULE_SLOT,
} from '@aztec/constants'
import {
  getContractInstanceFromDeployParams,
  getContractClassFromArtifact,
} from '@aztec/stdlib/contract'
import { PublicKeys } from '@aztec/stdlib/keys'
import {
  EasyPrivateVotingContractArtifact,
  EasyPrivateVotingContract,
} from '@/artifacts/EasyPrivateVoting'

type ContractCtorArgs = Parameters<EasyPrivateVotingContract['methods']['constructor']>

const constructorArgs = ['accopunt', 'Test Col', 'TEST', 'account', true, 1, 100, 0]
const classRegisterer = AztecAddress.fromNumber(REGISTERER_CONTRACT_ADDRESS)
const capsuleStorageSlot = new Fr(REGISTERER_CONTRACT_BYTECODE_CAPSULE_SLOT)

const { artifactHash, privateFunctionsRoot, publicBytecodeCommitment, packedBytecode } =
  await getContractClassFromArtifact(EasyPrivateVotingContractArtifact)

// const encodedBytecode = bufferAsFields(packedBytecode, MAX_PACKED_PUBLIC_BYTECODE_SIZE_IN_FIELDS)
const getChain = (account: string) => account?.substring(0, account.lastIndexOf(':'))

export const getDeployContractBatchCalls = async ({
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
  const { currentContractClassId } = instance

  const encodedBytecode = bufferAsFields(packedBytecode, MAX_PACKED_PUBLIC_BYTECODE_SIZE_IN_FIELDS)

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
          // here we provide the class registerer with our public bytecode via capsule
          kind: 'add_capsule',
          contract: classRegisterer,
          storageSlot: capsuleStorageSlot,
          capsule: encodedBytecode,
        },
        {
          // here we publicly register the contract class
          kind: 'call',
          contract: classRegisterer,
          method: 'register',
          args: [artifactHash, privateFunctionsRoot, publicBytecodeCommitment, true],
        },
      ],
    },
  ]

  return { sessionId, operations }
}
