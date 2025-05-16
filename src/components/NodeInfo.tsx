'use client'
import { NODE_URL } from '@/constants'
import { createAztecNodeClient } from '@aztec/aztec.js'
import { useEffect, useState } from 'react'

const aztecNode = createAztecNodeClient(NODE_URL)

export const NodeInfo = () => {
  const [blockNumber, setBlockNumber] = useState(0)
  useEffect(() => {
    aztecNode.getBlockNumber().then((blockNumber) => {
      setBlockNumber(blockNumber)
    })
    aztecNode.getChainId().then((chainId) => {
      console.log('Chain ID', chainId)
    })
    aztecNode.getNodeInfo().then((nodeInfo) => {
      console.log('node info', nodeInfo)
    })
  }, [])
  return (
    <footer>
      <p>Block No: {blockNumber}</p>
    </footer>
  )
}
