'use client'

import { useEffect, useRef } from 'react'
import * as Phaser from 'phaser'

export default function Game() {
  const gameRef = useRef<HTMLDivElement>(null)
  const gameInstanceRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    const initGame = async () => {
      try {
        const { createGame } = await import('../phaser/main')

        if (gameRef.current && !gameInstanceRef.current) {
          gameInstanceRef.current = createGame()
        }
      } catch (error) {
        console.error('Failed to load Phaser game:', error)
      }
    }

    initGame()

    // Cleanup function to destroy the game instance
    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true)
        gameInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div id="game-container" ref={gameRef} className="shadow-lg rounded-lg overflow-hidden"></div>
  )
}
