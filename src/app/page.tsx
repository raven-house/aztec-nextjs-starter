'use client'

import { Suspense, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Load the Game component dynamically with no SSR
const Game = dynamic(() => import('@/components/game/Game'), { ssr: false })
// import { Client, getStateCallbacks } from 'colyseus.js'
import { initGameState } from '../prover'

async function connect() {
  // const client = new Client('http://localhost:2567')
  // const room = await client.joinOrCreate('my_room', {
  //   /* custom join options */
  // })
  // const $ = getStateCallbacks(room)
  // // Listen to 'player' instance additions
  // $(room.state).players.onAdd((player, sessionId) => {
  //   console.log('Player joined:', player)
  // })
  // // Listen to 'player' instance removals
  // $(room.state).players.onRemove((player, sessionId) => {
  //   console.log('Player left:', player)
  // })
  // return room
}

// Load GameControls dynamically as well
// const GameControls = dynamic(() => import('@/components/ui/GameControls'), { ssr: false })

export default function Home() {
  useEffect(() => {
    connect()
    initGameState().then((res) => {
      console.log('Initialise game state', res)
    })
  }, [])
  return (
    <>
      <Suspense
        fallback={
          <div className="text-white text-xl p-12 bg-gray-900 rounded-lg text-center">
            Loading game...
          </div>
        }
      >
        <Game />
      </Suspense>

      {/* <div className="lg:w-1/4 w-full">
          <Suspense
            fallback={
              <div className="text-white p-4 bg-gray-900 rounded-lg">Loading controls...</div>
            }
          >
            <GameControls />
          </Suspense>
        </div> */}
    </>
  )
}
