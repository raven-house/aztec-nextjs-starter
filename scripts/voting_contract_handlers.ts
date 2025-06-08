import { PXE } from "@aztec/aztec.js";
import { VotingContract } from '@/artifacts/Voting'
import { setupWallets } from "./utils";
import { Logger } from "@/lib/Logger";
import { TestWallets } from "@/types";


let votingContract: VotingContract | null = null;
let wallets: TestWallets | null = null

export const deployVotingContract = async (pxe: PXE) => {
  wallets = await setupWallets(pxe);
  votingContract = await VotingContract.deploy(wallets.owner, wallets.owner.getAddress()).send().deployed()

  Logger.success(`Voting contract deployed on address ${votingContract.address.toString()}`)
  return { votingContract, wallets }
}

export const castVoteHandler = async (pxe: PXE, candidateId: number, walletNo: number) => {
  if (!votingContract && wallets) {
    Logger.info("Deploying new contract")
    const result = await deployVotingContract(pxe)
    votingContract = result.votingContract;
    wallets = result.wallets
  }
  let wallet = wallets?.owner;
  if (walletNo === 1) {
    wallet = wallets?.user1;
  }
  if (walletNo === 2) {
    wallet = wallets?.user2;
  }
  if (walletNo === 3) {
    wallet = wallets?.user3;
  }
  const castVoteTxn = await votingContract!.withWallet(wallet!).methods.cast_vote(candidateId).send().wait();
  Logger.success(`Vote casted successfully to candidate ${candidateId}. txn hash: ${castVoteTxn.txHash.toString()}`)
}


export const getVoteHandler = async (pxe: PXE, candidateId: number) => {
  if (!votingContract && wallets) {
    Logger.info("Deploying new contract")
    const result = await deployVotingContract(pxe)
    votingContract = result.votingContract;
    wallets = result.wallets
  }
  const voteCount = await votingContract!.methods.get_vote(candidateId).simulate();
  Logger.success(`Vote count for candidate ${candidateId}: ${voteCount}`)
}


export const endVoteHandler = async (pxe: PXE, walletNo: number) => {
  if (!votingContract && wallets) {
    Logger.info("Deploying new contract")
    const result = await deployVotingContract(pxe)
    votingContract = result.votingContract;
    wallets = result.wallets
  }
  let wallet = wallets?.owner;
  if (walletNo === 1) {
    wallet = wallets?.user1;
  }
  if (walletNo === 2) {
    wallet = wallets?.user2;
  }
  if (walletNo === 3) {
    wallet = wallets?.user3;
  }

  const endVoteTxn = await votingContract!.withWallet(wallet!).methods.end_vote().send().wait();
  Logger.success(`Ended vote with wallet ${wallet?.getAddress().toString()}. txn hash: ${endVoteTxn.txHash.toString()}`)
}
