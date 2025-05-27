import { Fr } from '@aztec/foundation/fields'
import { bufferAsFields } from '@aztec/stdlib/abi'
import { AztecAddress } from '@aztec/stdlib/aztec-address'
import {
  MAX_PACKED_PUBLIC_BYTECODE_SIZE_IN_FIELDS,
  REGISTERER_CONTRACT_ADDRESS,
  REGISTERER_CONTRACT_BYTECODE_CAPSULE_SLOT,
} from '@aztec/constants'
import { getContractClassFromArtifact } from '@aztec/stdlib/contract'
import { EasyPrivateVotingContractArtifact } from '@/artifacts/EasyPrivateVoting'

const classRegisterer = AztecAddress.fromNumber(REGISTERER_CONTRACT_ADDRESS)
const capsuleStorageSlot = new Fr(REGISTERER_CONTRACT_BYTECODE_CAPSULE_SLOT)

export const getDeployContractBatchCalls = async ({
  account,
  sessionId,
}: {
  account: any
  sessionId: string
}) => {
  const { artifactHash, privateFunctionsRoot, publicBytecodeCommitment, packedBytecode } =
    await getContractClassFromArtifact(EasyPrivateVotingContractArtifact)

  const encodedBytecode = bufferAsFields(packedBytecode, MAX_PACKED_PUBLIC_BYTECODE_SIZE_IN_FIELDS)

  const operations = [
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
