'use client'
import { GlobalContext } from '@/contexts/GlobalContext'
import { useContext } from 'react'
import { EasyPrivateVotingContract } from '../artifacts/EasyPrivateVoting'
import { Contract } from '@nemi-fi/wallet-sdk/eip1193'
import { useAccount } from '@nemi-fi/wallet-sdk/react'
import { sdk } from '@/components/Header'

class EasyPrivateVoting extends Contract.fromAztec(EasyPrivateVotingContract) {}

export default function Home() {
  const { walletAddress } = useContext(GlobalContext)
  const account = useAccount(sdk)

  if (!walletAddress) {
    return <div className="py-10"> Please connect your wallet first</div>
  }

  const handleEasyVotingContractDeploy = async () => {
    const deployTx = await EasyPrivateVoting.deploy(account!, account?.getAddress()!)
      .send()
      .wait({ timeout: 200000 })

    console.log('deploy TX', deployTx)
  }

  return (
    <main>
      <p>Address: {walletAddress}</p>
      <button onClick={handleEasyVotingContractDeploy}> Deploy Easy Voting Contract</button>
    </main>
  )
}
