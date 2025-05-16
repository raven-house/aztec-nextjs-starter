'use client'
import { NODE_URL } from '@/constants'
import { createAztecNodeClient } from '@aztec/aztec.js'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Blocks, Network, Server } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'

const aztecNode = createAztecNodeClient(NODE_URL)

export const NodeInfo = () => {
  const [blockNumber, setBlockNumber] = useState(0)
  const [chainId, setChainId] = useState('')
  const [nodeInfo, setNodeInfo] = useState({
    nodeVersion: '',
    l1ChainId: 0,
    rollupVersion: 0,
    l1ContractAddresses: {},
    protocolContractAddresses: {},
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNodeData = async () => {
      setIsLoading(true)
      try {
        const blockNum = await aztecNode.getBlockNumber()
        setBlockNumber(blockNum)

        const chain = await aztecNode.getChainId()
        setChainId(chain.toString())
        console.log('Chain ID', chain)

        const node = await aztecNode.getNodeInfo()
        setNodeInfo({
          nodeVersion: node.nodeVersion || 'Unknown',
          l1ChainId: node.l1ChainId || 0,
          rollupVersion: node.rollupVersion || 0,
          l1ContractAddresses: node.l1ContractAddresses || {},
          protocolContractAddresses: node.protocolContractAddresses || {},
        })
        console.log('node info', node)
      } catch (error) {
        console.error('Error fetching node info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNodeData()

    const interval = setInterval(fetchNodeData, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-border bg-gradient-to-b from-card to-background shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          Network Information
        </CardTitle>
        <CardDescription>Aztec Network Status</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">Chain ID</div>
                <Badge
                  variant="outline"
                  className="font-mono"
                >
                  {chainId}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Blocks className="h-4 w-4 text-primary" />
                  Latest Block
                </div>
                <Badge
                  variant="outline"
                  className="font-mono"
                >
                  {blockNumber}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Server className="h-4 w-4 text-primary" />
                  Node Information
                </div>
                <div className="rounded-md bg-secondary/10 p-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Node Version:</span>
                    <span className="font-mono">{nodeInfo.nodeVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">L1 Chain ID:</span>
                    <span className="font-mono">{nodeInfo.l1ChainId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rollup Version:</span>
                    <span className="font-mono">{nodeInfo.rollupVersion}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
