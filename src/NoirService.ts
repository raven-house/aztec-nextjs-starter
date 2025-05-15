import { UltraHonkBackend } from '@aztec/bb.js'
import {
  initialize_game_state,
  initialize_player_state,
  register_all_players,
  assign_initial_territories,
  commit_to_user_secrets,
  create_risk_adjacency_map,
  place_troops,
  execute_attack,
  execute_fortify,
  check_win_condition,
  end_turn,
  count_player_territories,
  Field,
  Territory,
  GameState,
  PlayerState,
  AdjacencyMap,
  TroopPlacementMove,
  AttackMove,
  FortifyMove,
  AttackResult,
  place_troops_circuit,
  place_troopsInputType,
} from './codegen/index'
import { Noir } from '@noir-lang/noir_js'

const placeTroopCircuit = new Noir(place_troops_circuit)

const backend = new UltraHonkBackend(place_troops_circuit.bytecode, {
  threads: navigator.hardwareConcurrency,
})

function randomField(): Field {
  return Math.floor(Math.random() * 100000000).toString()
}

class NoirRiskService {
  private gameState: GameState | null = null
  private playerStates: Map<number, PlayerState> = new Map()
  private adjacencyMap: AdjacencyMap | null = null

  // Initialize a new game
  async initializeGame(numPlayers: number): Promise<GameState> {
    try {
      this.gameState = await initialize_game_state(numPlayers.toString())
      this.adjacencyMap = await create_risk_adjacency_map()

      // Generate player secrets
      const playerSecrets: [Field, Field][] = []

      for (let i = 1; i <= numPlayers; i++) {
        const encryptSecret = randomField()
        const maskSecret = randomField()
        playerSecrets.push([encryptSecret, maskSecret])

        // Initialize player state
        const playerState = await initialize_player_state(i.toString(), encryptSecret, maskSecret)
        this.playerStates.set(i, playerState)
      }
      console.log('player state initialized')
      // Register all players
      this.gameState = await register_all_players(this.gameState, playerSecrets)

      // Assign territories
      const randomSeed = randomField()
      this.gameState = await assign_initial_territories(
        this.gameState,
        numPlayers.toString(),
        randomSeed
      )

      // Commit to secrets
      for (let i = 1; i <= numPlayers; i++) {
        const playerState = this.playerStates.get(i)!
        this.gameState = await commit_to_user_secrets(
          this.gameState,
          playerState.encrypt_secret,
          playerState.mask_secret,
          i.toString()
        )
      }

      return this.gameState
    } catch (error) {
      console.error('Failed to initialize game:', error)
      throw error
    }
  }

  async placeTroops(
    playerId: number,
    territoryId: number,
    troopCount: number
  ): Promise<[GameState, PlayerState, boolean]> {
    if (!this.gameState || !this.playerStates.has(playerId)) {
      throw new Error('Game not initialized or player state not found')
    }

    const moveData: TroopPlacementMove = {
      territory_id: territoryId.toString(),
      troop_count: troopCount.toString(),
    }

    try {
      const gameState = this.getGameState()
      console.log('game state 108', gameState)
      const start = performance.now()
      const initializationTime = performance.now() - start
      const { witness, returnValue } = await placeTroopCircuit.execute({
        game_state: gameState!,
        player_state: this.playerStates.get(playerId)!,
        move_data: moveData,
      })
      console.log('Witness', witness)
      const witnessTime = performance.now() - initializationTime
      let { proof } = await backend.generateProof(witness, {
        keccak: true,
      })
      proof = proof.slice(4)
      const provingTime = performance.now() - witnessTime
      console.log(`Proving time: ${provingTime}ms`)
      console.log('success')
      console.log('Return value', returnValue)
      // const result = await place_troops(this.gameState, this.playerStates.get(playerId)!, moveData)
      //@ts-ignore
      this.gameState = returnValue[0] as any as GameState
      //@ts-ignore
      this.playerStates.set(playerId, returnValue[1])
      console.log('territory placed successfully')
      // console.log('updated game state', result[0])
      return returnValue as any
    } catch (error) {
      console.error('Failed to place troops:', error)
      throw error
    }
  }

  async executeAttack(
    playerId: number,
    fromTerritoryId: number,
    toTerritoryId: number,
    attackTroopCount: number,
    diceRollSeed: string
  ): Promise<[GameState, PlayerState, AttackResult]> {
    if (!this.gameState || !this.playerStates.has(playerId) || !this.adjacencyMap) {
      throw new Error('Game not initialized, player state not found, or adjacency map not created')
    }

    const moveData: AttackMove = {
      from_territory_id: fromTerritoryId.toString(),
      to_territory_id: toTerritoryId.toString(),
      attack_troop_count: attackTroopCount.toString(),
      dice_roll_seed: diceRollSeed,
    }

    try {
      const result = await execute_attack(
        this.gameState,
        this.playerStates.get(playerId)!,
        this.adjacencyMap,
        moveData
      )

      this.gameState = result[0]
      this.playerStates.set(playerId, result[1])

      return result
    } catch (error) {
      console.error('Failed to execute attack:', error)
      throw error
    }
  }

  async executeFortify(
    playerId: number,
    fromTerritoryId: number,
    toTerritoryId: number,
    troopCount: number
  ): Promise<[GameState, PlayerState, boolean]> {
    if (!this.gameState || !this.playerStates.has(playerId) || !this.adjacencyMap) {
      throw new Error('Game not initialized, player state not found, or adjacency map not created')
    }

    const moveData: FortifyMove = {
      from_territory_id: fromTerritoryId.toString(),
      to_territory_id: toTerritoryId.toString(),
      troop_count: troopCount.toString(),
    }

    try {
      const result = await execute_fortify(
        this.gameState,
        this.playerStates.get(playerId)!,
        this.adjacencyMap,
        moveData
      )

      this.gameState = result[0]
      this.playerStates.set(playerId, result[1])

      return result
    } catch (error) {
      console.error('Failed to execute fortify:', error)
      throw error
    }
  }

  async endTurn(): Promise<GameState> {
    if (!this.gameState) {
      throw new Error('Game not initialized')
    }

    try {
      this.gameState = await end_turn(this.gameState)
      return this.gameState
    } catch (error) {
      console.error('Failed to end turn:', error)
      throw error
    }
  }

  async checkWinCondition(): Promise<GameState> {
    if (!this.gameState) {
      throw new Error('Game not initialized')
    }

    try {
      this.gameState = await check_win_condition(this.gameState)
      return this.gameState
    } catch (error) {
      console.error('Failed to check win condition:', error)
      throw error
    }
  }

  async countPlayerTerritories(): Promise<Field[]> {
    if (!this.gameState) {
      throw new Error('Game not initialized')
    }

    try {
      return await count_player_territories(this.gameState)
    } catch (error) {
      console.error('Failed to count player territories:', error)
      throw error
    }
  }

  getGameState(): GameState | null {
    return this.gameState
  }

  getPlayerState(playerId: number): PlayerState | undefined {
    return this.playerStates.get(playerId)
  }

  getAdjacencyMap(): AdjacencyMap | null {
    return this.adjacencyMap
  }

  convertNoirTerritoryToPhaserTerritory(noirTerritory: Territory) {
    return {
      id: parseInt(noirTerritory.id),
      owner: parseInt(noirTerritory.owner_id),
      armies: parseInt(noirTerritory.troop_count),
    }
  }

  updatePlayerState(playerId: number, newState: PlayerState): void {
    this.playerStates.set(playerId, newState)
  }
}

export default new NoirRiskService()
