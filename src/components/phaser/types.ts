export interface TerritoryState {
  id: number
  name: string
  owner: number | null
  armies: number
  continent: string
  isSelected: boolean
}

export interface Player {
  id: number
  color: number
  armies: number
  territories: number[]
  reinforcements: number
  eliminated: boolean
}

export interface TerritoryData {
  id: number
  name: string
  x: number
  y: number
  continent: string
}

export interface ContinentData {
  territories: number[]
  bonus: number
}

export interface GameState {
  players: Player[]
  currentPlayerIndex: number
  gamePhase: 'initialPlacement' | 'placement' | 'attack' | 'fortify'
  selectedTerritoryId: number | null
  targetTerritoryId: number | null
  initialPlacementDone: boolean
}

// Extend Window interface
declare global {
  interface Window {
    gameState: GameState
  }
}
