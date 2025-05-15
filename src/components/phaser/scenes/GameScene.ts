import * as Phaser from 'phaser'
import { TerritoryManager } from '../objects/TerritoryManager'
import { Territory } from '../objects/Territory'
import { TerritoryData, ContinentData, Player } from '../types'
import NoirService from '@/NoirService'

// Territory data
const territoriesData: TerritoryData[] = [
  // North America (Red) - 4 territories
  { id: 0, name: 'NA-1', x: 155, y: 240, continent: 'North America' },
  { id: 1, name: 'NA-2', x: 152, y: 162, continent: 'North America' },
  { id: 2, name: 'NA-3', x: 240, y: 186, continent: 'North America' },
  { id: 3, name: 'NA-4', x: 201, y: 115, continent: 'North America' },

  // Europe (Green) - 6 territories
  { id: 14, name: 'EU-1', x: 516, y: 247, continent: 'Europe' },
  { id: 15, name: 'EU-2', x: 440, y: 88, continent: 'Europe' },
  { id: 16, name: 'EU-3', x: 523, y: 123, continent: 'Europe' },
  { id: 17, name: 'EU-4', x: 454, y: 200, continent: 'Europe' },
  { id: 18, name: 'EU-5', x: 423, y: 150, continent: 'Europe' },
  { id: 19, name: 'EU-6', x: 543, y: 182, continent: 'Europe' },

  // Africa (Blue) - 5 territories
  { id: 9, name: 'AF-1', x: 339, y: 223, continent: 'Africa' },
  { id: 10, name: 'AF-2', x: 386, y: 263, continent: 'Africa' },
  { id: 11, name: 'AF-3', x: 384, y: 348, continent: 'Africa' },
  { id: 12, name: 'AF-4', x: 298, y: 375, continent: 'Africa' },
  { id: 13, name: 'AF-5', x: 308, y: 296, continent: 'Africa' },

  // South America (Yellow) - 5 territories
  { id: 4, name: 'SA-1', x: 155, y: 355, continent: 'South America' },
  { id: 5, name: 'SA-2', x: 140, y: 416, continent: 'South America' },
  { id: 6, name: 'SA-3', x: 199, y: 427, continent: 'South America' },
  { id: 7, name: 'SA-4', x: 155, y: 504, continent: 'South America' },
  { id: 8, name: 'SA-5', x: 241, y: 494, continent: 'South America' },

  // Australia (Purple) - 5 territories
  { id: 20, name: 'AU-1', x: 510, y: 345, continent: 'Australia' },
  { id: 21, name: 'AU-2', x: 450, y: 424, continent: 'Australia' },
  { id: 22, name: 'AU-3', x: 569, y: 411, continent: 'Australia' },
  { id: 23, name: 'AU-4', x: 508, y: 497, continent: 'Australia' },
  { id: 24, name: 'AU-5', x: 430, y: 509, continent: 'Australia' },
]

// Adjacency map data
const adjacencyMapData = {
  // North America
  0: [1, 2, 4], // NA1 connects to NA2, NA3, SA1
  1: [0, 2, 3], // NA2 connects to NA1, NA3, NA4
  2: [0, 1, 3, 9, 18], // NA3 connects to NA1, NA2, NA4, AF1, EU5
  3: [1, 2, 15], // NA4 connects to NA2, NA3, EU2

  // South America
  4: [0, 5, 6, 13], // SA1 connects to NA1, SA2, SA3, AF5
  5: [4, 6, 7], // SA2 connects to SA1, SA3, SA4
  6: [4, 5, 7, 8, 12], // SA3 connects to SA1, SA2, SA4, SA5, AF4
  7: [5, 6, 8], // SA4 connects to SA2, SA3, SA5
  8: [6, 7, 24], // SA5 connects to SA3, SA4, AU5

  // Africa
  9: [2, 10, 13, 18], // AF1 connects to NA3, AF2, AF5, EU5
  10: [9, 11, 13, 14, 17, 20], // AF2 connects to AF1, AF3, AF5, EU1, EU4, AU1
  11: [10, 12, 20, 21], // AF3 connects to AF2, AF4, AU1, AU2
  12: [6, 11, 13, 21], // AF4 connects to SA3, AF3, AF5, AU2
  13: [4, 9, 10, 12], // AF5 connects to SA1, AF1, AF2, AF4

  // Europe
  14: [10, 17, 19, 20], // EU1 connects to AF2, EU4, EU6, AU1
  15: [3, 16, 18, 19], // EU2 connects to NA4, EU3, EU5, EU6
  16: [15, 17, 18, 19], // EU3 connects to EU2, EU4, EU5, EU6
  17: [10, 14, 16, 18, 19], // EU4 connects to AF2, EU1, EU3, EU5, EU6
  18: [2, 9, 15, 16, 17], // EU5 connects to NA3, AF1, EU2, EU3, EU4
  19: [14, 15, 16, 17], // EU6 connects to EU1, EU2, EU3, EU4

  // Australia
  20: [10, 11, 14, 21, 22], // AU1 connects to AF2, AF3, EU1, AU2, AU3
  21: [11, 12, 20, 22, 23, 24], // AU2 connects to AF3, AF4, AU1, AU3, AU4, AU5
  22: [20, 21, 23, 24], // AU3 connects to AU1, AU2, AU4, AU5
  23: [21, 22, 24], // AU4 connects to AU2, AU3, AU5
  24: [8, 21, 22, 23], // AU5 connects to SA5, AU2, AU3, AU4
}

// Define continents and their bonus values
const continentsData: Record<string, ContinentData> = {
  'North America': { territories: [0, 1, 2, 3], bonus: 5 },
  Europe: { territories: [4, 5, 6, 7, 8, 9], bonus: 5 },
  Africa: { territories: [10, 11, 12, 13, 14], bonus: 3 },
  'South America': { territories: [15, 16, 17, 18, 19], bonus: 2 },
  Australia: { territories: [20, 21, 22, 23, 24], bonus: 2 },
}

export class GameScene extends Phaser.Scene {
  private territoryManager!: TerritoryManager
  private phaseText!: Phaser.GameObjects.Text
  private playerText!: Phaser.GameObjects.Text
  private actionText!: Phaser.GameObjects.Text
  private diceText!: Phaser.GameObjects.Text
  private diceResults: number[] = []
  private continents: Record<string, ContinentData>
  private hasFortified: boolean = false
  private endTurnButton!: Phaser.GameObjects.Rectangle
  private endTurnText!: Phaser.GameObjects.Text
  private diceContainer!: Phaser.GameObjects.Container
  private attackerDiceSprites: Phaser.GameObjects.Sprite[] = []
  private defenderDiceSprites: Phaser.GameObjects.Sprite[] = []
  private resultIndicators: Phaser.GameObjects.Text[] = []
  private loadingText!: Phaser.GameObjects.Text
  private noirStatusText!: Phaser.GameObjects.Text
  private isNoirInitialized: boolean = false
  private loading: boolean = false

  constructor() {
    super({ key: 'GameScene' })
    this.continents = continentsData
  }

  create() {
    // Add a dark background
    this.add.rectangle(600, 400, 1200, 800, 0x000000).setOrigin(0.5)

    // Start with camera faded out, then fade in
    this.cameras.main.fadeIn(800, 0, 0, 0)

    this.loadingText = this.add
      .text(600, 400, 'Loading Noir Contract...', {
        fontSize: '32px',
        color: '#FFFFFF',
      })
      .setOrigin(0.5)
      .setDepth(1000)
      .setVisible(false)

    // Create noir status text
    this.noirStatusText = this.add
      .text(950, 40, 'Noir: Initializing', {
        fontSize: '14px',
        color: '#99FF99',
      })
      .setOrigin(0.5)
      .setDepth(100)

    // Initialize territory manager
    this.territoryManager = new TerritoryManager(this, adjacencyMapData)

    // Set up territory click handler
    this.territoryManager.onTerritoryClick = (territory) => {
      this.handleTerritoryClick(territory)
    }

    // Create territories
    this.territoryManager.createTerritories(territoriesData)

    // Draw connection lines between territories
    const graphics = this.add.graphics()
    this.territoryManager.drawConnectionLines(graphics)

    // Initialize game info display
    this.setupGameInfo()

    // Create dice display
    this.createDiceDisplay()

    // Create action button
    this.setupButtons()

    // Start the initial placement phase
    this.initializeNoirContract().then(() => {
      this.startPlacementPhase()
    })
    //@ts-ignore
    window.gameEvents.on('territoryClicked', (data) => {
      // Handle based on phase - exactly like you do now

      console.log('TErritory is clicked, got it by events normally')

      if (data.phase === 'placement') {
        console.log('TErritory is clicked, got it by events placement phase')
        this.territoryManager.addTerritoryArmies(data.territoryId, 1)
        // Update current player's reinforcements
        // ... rest of your existing code
      }
    })
  }

  async initializeNoirContract() {
    this.showLoading('Initializing Noir Risk Contract...')

    try {
      const numPlayers = window.gameState.players.length

      // Initialize the game state using Noir contract
      const gameState = await NoirService.initializeGame(2)

      this.isNoirInitialized = true
      this.noirStatusText.setText('Noir: Connected ✓')
      this.noirStatusText.setColor('#99FF99')

      console.log('Noir Circuits initialized:', gameState)
      this.hideLoading()
      return gameState
    } catch (error) {
      console.error('Failed to initialize Noir circuits:', error)
      this.noirStatusText.setText('Noir: Error X')
      this.noirStatusText.setColor('#FF9999')
      this.hideLoading()

      // Fallback to traditional game logic if Noir fails
      // this.showNoirErrorMessage('Failed to initialize Noir Circuits. Falling back to local mode.')
      return null
    }
  }

  showLoading(message: string) {
    this.loading = true
    this.loadingText.setText(message)
    this.loadingText.setVisible(true)

    // Add a rotating spinner animation
    this.tweens.add({
      targets: this.loadingText,
      alpha: 0.6,
      duration: 500,
      yoyo: true,
      repeat: -1,
    })
  }

  hideLoading() {
    this.loading = false
    this.loadingText.setVisible(false)
    this.tweens.killTweensOf(this.loadingText)
  }

  setupGameInfo() {
    // Background for game info
    this.add.rectangle(950, 400, 340, 750, 0x222222)

    // Game phase text
    this.phaseText = this.add
      .text(950, 100, 'Phase: Placement', {
        fontSize: '20px',
        color: '#FFF',
      })
      .setOrigin(0.5)

    // Current player text
    this.playerText = this.add
      .text(950, 140, 'Player: 1', {
        fontSize: '20px',
        color: '#FFF',
      })
      .setOrigin(0.5)

    // Action text/Instructions
    this.actionText = this.add
      .text(950, 180, 'Place your armies', {
        fontSize: '16px',
        color: '#FFF',
        align: 'center',
        wordWrap: { width: 280 },
      })
      .setOrigin(0.5)

    // Dice results (will be updated during battles)
    this.diceText = this.add
      .text(950, 240, '', {
        fontSize: '16px',
        color: '#FFF',
        align: 'center',
      })
      .setOrigin(0.5)

    // Continent bonus information
    let yPos = 500
    this.add
      .text(950, yPos, 'Continent Bonuses:', {
        fontSize: '16px',
        color: '#FFF',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    yPos += 30
    for (const continent in this.continents) {
      this.add
        .text(950, yPos, `${continent}: +${this.continents[continent].bonus}`, {
          fontSize: '14px',
          color: '#FFF',
        })
        .setOrigin(0.5)
      yPos += 20
    }
  }

  setupButtons() {
    // End turn button
    this.endTurnButton = this.add.rectangle(950, 700, 240, 40, 0x444444).setInteractive()
    this.endTurnText = this.add
      .text(950, 700, 'End Phase', {
        fontSize: '18px',
        color: '#FFF',
      })
      .setOrigin(0.5)

    this.endTurnButton.on('pointerdown', () => {
      // Add button press animation
      this.tweens.add({
        targets: this.endTurnButton,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          this.endTurn()
        },
      })
    })

    this.endTurnButton.on('pointerover', () => {
      this.endTurnButton.setFillStyle(0x666666)

      // Add hover scale animation
      this.tweens.add({
        targets: this.endTurnButton,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
        ease: 'Sine.easeOut',
      })

      // Also scale the text
      this.tweens.add({
        targets: this.endTurnText,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
        ease: 'Sine.easeOut',
      })
    })

    this.endTurnButton.on('pointerout', () => {
      this.endTurnButton.setFillStyle(0x444444)

      // Reset scale on hover out
      this.tweens.add({
        targets: [this.endTurnButton, this.endTurnText],
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: 'Sine.easeOut',
      })
    })

    // Initially disable end turn button during placement
    this.endTurnButton.disableInteractive()
    this.endTurnButton.setFillStyle(0x333333)
  }

  startPlacementPhase() {
    window.gameState.gamePhase = 'initialPlacement'
    window.gameState.initialPlacementDone = false
    this.phaseText.setText('Phase: Initial Placement')

    // Calculate initial armies based on players
    const numPlayers = window.gameState.players.length

    const initialArmies = Math.max(40 - (numPlayers - 2) * 5, 20)

    window.gameState.players.forEach((player) => {
      player.armies = initialArmies
      player.reinforcements = initialArmies
    })

    // Randomly assign territories to players
    this.assignTerritories()

    // Update display
    this.updateGameInfo()

    // Disable end turn button during initial placement
    this.endTurnButton.disableInteractive()
    this.endTurnButton.setFillStyle(0x333333)
  }

  assignTerritories() {
    // Create a copy of territory IDs
    const territoryIds = this.territoryManager.getAllTerritories().map((t) => t.id)

    // Shuffle territory IDs
    for (let i = territoryIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[territoryIds[i], territoryIds[j]] = [territoryIds[j], territoryIds[i]]
    }

    console.log('Game state in assign territories', NoirService.getGameState()?.territories)
    // Assign territories evenly to players with animation
    const numPlayers = window.gameState.players.length

    // Display an "assigning territories" message
    const assignText = this.add
      .text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'ASSIGNING TERRITORIES', {
        fontSize: '40px',
        fontStyle: 'bold',
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(1000)

    // Animate text
    this.tweens.add({
      targets: assignText,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.5, to: 1 },
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Fade out after a short delay
        this.time.delayedCall(1000, () => {
          this.tweens.add({
            targets: assignText,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
              assignText.destroy()
            },
          })
        })
      },
    })

    const territories = NoirService.getGameState()?.territories
    console.log('territories from circuit', territories)
    if (!territories) return
    for (let i = 0; i < territories!.length; i++) {
      const territory = territories[i]
      const territoryId = parseInt(territory.id)
      const playerId = parseInt(territory.owner_id)
      const player = window.gameState.players[playerId - 1]

      // Use delayed call to create staggered assignment animation
      this.time.delayedCall(1500 + i * 50, () => {
        // Assign territory to player
        this.territoryManager.setTerritoryOwner(territoryId, player)
        this.territoryManager.setTerritoryArmies(territoryId, 1)

        // Flash effect for territory assignment
        const territory = this.territoryManager.getTerritory(territoryId)
        if (territory) {
          this.tweens.add({
            targets: territory.image,
            scaleX: territory.originalScale * 1.2,
            scaleY: territory.originalScale * 1.2,
            duration: 150,
            yoyo: true,
            ease: 'Sine.easeInOut',
          })
        }

        // Add territory to player's list
        player.territories.push(territoryId)

        // Reduce player's reinforcements
        player.reinforcements--
      })
    }
  }

  updateGameInfo() {
    const currentPlayer = window.gameState.players[window.gameState.currentPlayerIndex]

    if (currentPlayer.eliminated) {
      // Skip to next player if current one is eliminated
      this.endTurn()
      return
    }

    // Update player text with color
    this.playerText.setText(`Player: ${window.gameState.currentPlayerIndex + 1}`)
    this.playerText.setColor(this.hexNumToHexString(currentPlayer.color))

    // Update phase text
    if (window.gameState.gamePhase === 'initialPlacement') {
      this.phaseText.setText('Phase: Initial Placement')
    } else {
      this.phaseText.setText(`Phase: ${this.capitalizeFirstLetter(window.gameState.gamePhase)}`)
    }

    // Update end turn button text based on phase
    if (window.gameState.gamePhase === 'placement') {
      this.endTurnText.setText('Start Attack Phase')
    } else if (window.gameState.gamePhase === 'attack') {
      this.endTurnText.setText('Start Fortify Phase')
    } else if (window.gameState.gamePhase === 'fortify') {
      this.endTurnText.setText('End Turn')
    } else {
      // Initial placement phase
      this.endTurnText.setText('Please Place Armies')
    }

    // Update action text based on game phase
    if (window.gameState.gamePhase === 'initialPlacement') {
      this.actionText.setText(
        `Initial Placement\nPlayer ${window.gameState.currentPlayerIndex + 1}'s turn\nRemaining: ${
          currentPlayer.reinforcements
        }`
      )
    } else if (window.gameState.gamePhase === 'placement') {
      this.actionText.setText(
        `Player ${
          window.gameState.currentPlayerIndex + 1
        }'s turn\nPlace your reinforcements\nRemaining: ${currentPlayer.reinforcements}`
      )
    } else if (window.gameState.gamePhase === 'attack') {
      this.actionText.setText('Select your territory to attack from')
    } else if (window.gameState.gamePhase === 'fortify') {
      this.actionText.setText('Select territory to move armies from or end turn')
    }
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  hexNumToHexString(color: number): string {
    // Convert RGB color to hex string
    return '#' + color.toString(16).padStart(6, '0')
  }

  endTurn() {
    // Handle different phase transitions
    if (window.gameState.gamePhase === 'placement') {
      // From placement -> attack (same player)
      window.gameState.gamePhase = 'attack'

      // Phase transition animation
      this.createPhaseTransitionAnimation('attack')

      this.updateGameInfo()
      return
    } else if (window.gameState.gamePhase === 'attack') {
      // From attack -> fortify (same player)
      window.gameState.gamePhase = 'fortify'
      this.hasFortified = false

      // Phase transition animation
      this.createPhaseTransitionAnimation('fortify')

      // Reset selections
      if (window.gameState.selectedTerritoryId !== null) {
        this.territoryManager.setTerritorySelected(window.gameState.selectedTerritoryId, false)
        window.gameState.selectedTerritoryId = null
      }
      window.gameState.targetTerritoryId = null

      this.updateGameInfo()
      return
    } else if (window.gameState.gamePhase === 'fortify') {
      // Reset selected territories
      if (window.gameState.selectedTerritoryId !== null) {
        this.territoryManager.setTerritorySelected(window.gameState.selectedTerritoryId, false)
        window.gameState.selectedTerritoryId = null
      }
      window.gameState.targetTerritoryId = null

      // Find the next active player (not eliminated)
      let nextPlayerFound = false
      let nextPlayerIndex = window.gameState.currentPlayerIndex
      const playerCount = window.gameState.players.length

      for (let i = 1; i <= playerCount; i++) {
        // Calculate next player index with wrapping
        nextPlayerIndex = (window.gameState.currentPlayerIndex + i) % playerCount

        // Check if this player is still in the game
        if (!window.gameState.players[nextPlayerIndex].eliminated) {
          nextPlayerFound = true
          break
        }
      }

      // If no active players found besides current one, game is over
      if (!nextPlayerFound) {
        // Current player wins!
        this.gameOver(window.gameState.currentPlayerIndex)
        return
      }

      // Move to the next active player
      window.gameState.currentPlayerIndex = nextPlayerIndex
      const currentPlayer = window.gameState.players[window.gameState.currentPlayerIndex]

      // Calculate reinforcements including continent bonuses for the new player
      currentPlayer.reinforcements = this.calculateReinforcements(currentPlayer)

      // Create player turn change animation
      this.createPlayerTurnAnimation(window.gameState.currentPlayerIndex)

      // Move to placement phase for next player
      window.gameState.gamePhase = 'placement'

      // Add slight delay, then show placement phase animation
      this.time.delayedCall(1500, () => {
        this.createPhaseTransitionAnimation('placement')
      })

      // Update display
      this.updateGameInfo()

      // Disable end turn button until player places all armies
      this.endTurnButton.disableInteractive()
      this.endTurnButton.setFillStyle(0x333333)
    }
  }

  createPhaseTransitionAnimation(newPhase: string) {
    // Create a text overlay for the phase change
    const phaseText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        newPhase.toUpperCase() + ' PHASE',
        {
          fontSize: '64px',
          fontStyle: 'bold',
          color: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 6,
          align: 'center',
        }
      )
      .setOrigin(0.5)

    phaseText.setAlpha(0)
    phaseText.setScale(0.5)
    phaseText.setDepth(1000)

    // First tween - fade in and scale up
    this.tweens.add({
      targets: phaseText,
      alpha: 1,
      scale: 1.2,
      duration: 600,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Second tween - hold for a moment
        this.time.delayedCall(800, () => {
          // Third tween - fade out and scale up more
          this.tweens.add({
            targets: phaseText,
            alpha: 0,
            scale: 1.5,
            duration: 500,
            ease: 'Back.easeIn',
            onComplete: () => {
              phaseText.destroy()
            },
          })
        })
      },
    })
  }

  async handleTerritoryClick(territory: Territory) {
    const currentPlayer = window.gameState.players[window.gameState.currentPlayerIndex]

    //@ts-ignore
    window.gameEvents.emit('territoryClicked', {
      territoryId: territory.id,
      phase: window.gameState.gamePhase,
    })

    // INITIAL PLACEMENT PHASE
    if (window.gameState.gamePhase === 'initialPlacement') {
      if (territory.owner === currentPlayer.id && currentPlayer.reinforcements > 0) {
        // Place an army
        await NoirService.placeTroops(currentPlayer.id + 1, territory.id, 1)
        this.territoryManager.addTerritoryArmies(territory.id, 1)
        currentPlayer.reinforcements--
        this.updateGameInfo()

        // If current player has placed all armies, move to next player
        if (currentPlayer.reinforcements === 0) {
          // Move to the next player
          window.gameState.currentPlayerIndex =
            (window.gameState.currentPlayerIndex + 1) % window.gameState.players.length

          // Check if all players have placed their initial armies
          let allPlaced = true
          for (const player of window.gameState.players) {
            if (player.reinforcements > 0) {
              allPlaced = false
              break
            }
          }

          // If all players have placed their armies, start regular game flow
          if (allPlaced) {
            window.gameState.initialPlacementDone = true
            window.gameState.gamePhase = 'placement'

            // Reset to first player and give reinforcements
            window.gameState.currentPlayerIndex = 0
            const firstPlayer = window.gameState.players[0]
            firstPlayer.reinforcements = this.calculateReinforcements(firstPlayer)

            // Enable end phase button
            this.endTurnButton.setInteractive()
            this.endTurnButton.setFillStyle(0x444444)
          }

          this.updateGameInfo()
        }
      }
    }
    // REGULAR PLACEMENT PHASE
    else if (window.gameState.gamePhase === 'placement') {
      if (territory.owner === currentPlayer.id && currentPlayer.reinforcements > 0) {
        // Place an army
        this.territoryManager.addTerritoryArmies(territory.id, 1)
        currentPlayer.reinforcements--
        this.updateGameInfo()

        // If all reinforcements placed, enable the end phase button
        if (currentPlayer.reinforcements === 0) {
          // Enable end turn button - player can now move to attack phase
          this.endTurnButton.setInteractive()
          this.endTurnButton.setFillStyle(0x444444)
          this.updateGameInfo()
        }
      }
    }
    // ATTACK PHASE
    else if (window.gameState.gamePhase === 'attack') {
      if (window.gameState.selectedTerritoryId === null) {
        // Selecting the attacking territory
        if (territory.owner === currentPlayer.id && territory.armies > 1) {
          window.gameState.selectedTerritoryId = territory.id
          this.territoryManager.setTerritorySelected(territory.id, true)
          this.actionText.setText('Select an adjacent territory to attack')
        } else if (territory.owner === currentPlayer.id && territory.armies <= 1) {
          this.actionText.setText('Need at least 2 armies to attack')
        }
      } else {
        // Selecting the defending territory and attack
        if (
          territory.owner !== currentPlayer.id &&
          this.territoryManager.areAdjacent(window.gameState.selectedTerritoryId, territory.id)
        ) {
          window.gameState.targetTerritoryId = territory.id
          this.resolveAttack()
        } else if (territory.id === window.gameState.selectedTerritoryId) {
          this.territoryManager.setTerritorySelected(window.gameState.selectedTerritoryId, false)
          window.gameState.selectedTerritoryId = null
          this.actionText.setText('Select your territory to attack from')
        } else {
          // Invalid target, reset selection
          if (window.gameState.selectedTerritoryId !== null) {
            this.territoryManager.setTerritorySelected(window.gameState.selectedTerritoryId, false)
            window.gameState.selectedTerritoryId = null
          }
          this.actionText.setText('Invalid target. Select your territory to attack from')
        }
      }
    }
    // FORTIFY PHASE
    else if (window.gameState.gamePhase === 'fortify') {
      if (this.hasFortified) {
        this.actionText.setText("You've already fortified this turn. Please end your turn.")
        return
      }

      if (window.gameState.selectedTerritoryId === null) {
        // Selecting the source territory
        if (territory.owner === currentPlayer.id && territory.armies > 1) {
          window.gameState.selectedTerritoryId = territory.id
          this.territoryManager.setTerritorySelected(territory.id, true)
          this.actionText.setText('Select any friendly territory to fortify')
        }
      } else {
        // Selection the destination territory
        if (
          territory.owner === currentPlayer.id &&
          territory.id !== window.gameState.selectedTerritoryId
        ) {
          window.gameState.targetTerritoryId = territory.id
          this.fortifyTerritory()
        } else if (territory.id === window.gameState.selectedTerritoryId) {
          // Deselect
          this.territoryManager.setTerritorySelected(window.gameState.selectedTerritoryId, false)
          window.gameState.selectedTerritoryId = null
          this.actionText.setText('Select territory to move armies from or end turn')
        } else {
          // Invalid target, reset selection
          if (window.gameState.selectedTerritoryId !== null) {
            this.territoryManager.setTerritorySelected(window.gameState.selectedTerritoryId, false)
            window.gameState.selectedTerritoryId = null
          }
          this.actionText.setText('Invalid target. Select territory to move armies or end turn')
        }
      }
    }
  }

  resolveAttack() {
    if (
      window.gameState.selectedTerritoryId === null ||
      window.gameState.targetTerritoryId === null
    ) {
      return
    }

    const attackerTerritory = this.territoryManager.getTerritory(
      window.gameState.selectedTerritoryId
    )
    const defenderTerritory = this.territoryManager.getTerritory(window.gameState.targetTerritoryId)

    if (!attackerTerritory || !defenderTerritory) return

    // Maximum number of dice
    const maxAttackerDice = Math.min(3, attackerTerritory.armies - 1)
    const maxDefenderDice = Math.min(2, defenderTerritory.armies)

    // Roll dice
    const attackerDice = this.rollDice(maxAttackerDice).sort((a, b) => b - a)
    const defenderDice = this.rollDice(maxDefenderDice).sort((a, b) => b - a)

    // Display dice results visually
    this.showDiceRoll(attackerDice, defenderDice)

    // Compare dice pairs
    let attackerLosses = 0
    let defenderLosses = 0

    for (let i = 0; i < Math.min(attackerDice.length, defenderDice.length); i++) {
      if (attackerDice[i] > defenderDice[i]) {
        defenderLosses++
      } else {
        attackerLosses++
      }
    }

    // Apply losses
    this.territoryManager.removeTerritoryArmies(
      window.gameState.selectedTerritoryId,
      attackerLosses
    )
    this.territoryManager.removeTerritoryArmies(window.gameState.targetTerritoryId, defenderLosses)

    // Update text with results
    this.actionText.setText(
      `Battle results\n` +
        `Attacker lost ${attackerLosses} armies\n` +
        `Defender lost ${defenderLosses} armies`
    )

    // Check if defender was defeated
    if (defenderTerritory.armies - defenderLosses <= 0) {
      // Get player references
      const defenderPlayer = window.gameState.players[defenderTerritory.owner!]

      // Calculate armies to move (all but 1 from attacker)
      const armiesToMove = attackerTerritory.armies - attackerLosses - 1

      // Capture the territory
      this.territoryManager.captureTerritory(
        window.gameState.selectedTerritoryId,
        window.gameState.targetTerritoryId,
        armiesToMove
      )

      // Set action text with capture message
      this.actionText.setText(`You captured ${defenderTerritory.name}!`)

      // Check if the defender player has been eliminated
      if (defenderPlayer.territories.length === 0) {
        defenderPlayer.eliminated = true
        this.showPlayerEliminationMessage(defenderPlayer.id)
      }
    }

    // Reset selections
    if (window.gameState.selectedTerritoryId !== null) {
      this.territoryManager.setTerritorySelected(window.gameState.selectedTerritoryId, false)
    }
    window.gameState.selectedTerritoryId = null
    window.gameState.targetTerritoryId = null

    // Check for game over
    this.checkGameOver()
  }

  rollDice(count: number): number[] {
    const results = []
    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * 6) + 1)
    }
    return results
  }

  createDiceDisplay() {
    // Create a container for dice display
    this.diceContainer = this.add.container(950, 280)
    this.diceContainer.setVisible(false)

    // Title text
    this.diceContainer.add(
      this.add
        .text(0, -40, 'DICE BATTLE', {
          fontSize: '18px',
          color: '#FFFFFF',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)
    )

    // Attacker label
    this.diceContainer.add(
      this.add
        .text(-100, -20, 'Attacker', {
          fontSize: '14px',
          color: '#FF0000',
        })
        .setOrigin(0.5)
    )

    // Defender label
    this.diceContainer.add(
      this.add
        .text(100, -20, 'Defender', {
          fontSize: '14px',
          color: '#0000FF',
        })
        .setOrigin(0.5)
    )

    // Create placeholders for attacker dice
    this.attackerDiceSprites = []
    for (let i = 0; i < 3; i++) {
      const diceSprite = this.add.sprite(-100, 20 + i * 70, 'dice', 0)
      diceSprite.setVisible(false)
      this.diceContainer.add(diceSprite)
      this.attackerDiceSprites.push(diceSprite)
    }

    // Create placeholders for defender dice
    this.defenderDiceSprites = []
    for (let i = 0; i < 2; i++) {
      const diceSprite = this.add.sprite(100, 20 + i * 70, 'dice', 0)
      diceSprite.setVisible(false)
      this.diceContainer.add(diceSprite)
      this.defenderDiceSprites.push(diceSprite)
    }

    // Result indicators (win/loss)
    this.resultIndicators = []
    for (let i = 0; i < 3; i++) {
      const winIndicator = this.add
        .text(0, 20 + i * 70, '', {
          fontSize: '24px',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)
      this.diceContainer.add(winIndicator)
      this.resultIndicators.push(winIndicator)
    }
  }

  showDiceRoll(attackerDice: number[], defenderDice: number[]) {
    this.diceContainer.setVisible(true)

    // Create a background flash effect for dice battle
    const flashOverlay = this.add
      .rectangle(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        this.cameras.main.width,
        this.cameras.main.height,
        0xffffff,
        0.3
      )
      .setDepth(500)

    // Animate flash overlay
    this.tweens.add({
      targets: flashOverlay,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        flashOverlay.destroy()
      },
    })

    // Set up dice animation
    const rollDuration = 1000 // 1 second for dice animation
    const rollFrames = 10 // Number of "rolls" before settling

    // Hide all dice initially
    this.attackerDiceSprites.forEach((dice) => dice.setVisible(false))
    this.defenderDiceSprites.forEach((dice) => dice.setVisible(false))
    this.resultIndicators.forEach((indicator) => indicator.setText(''))

    // Show only the dice being used
    for (let i = 0; i < attackerDice.length; i++) {
      this.attackerDiceSprites[i].setVisible(true)
      this.attackerDiceSprites[i].setScale(0) // Start small for animation

      // Animate dice appearance
      this.tweens.add({
        targets: this.attackerDiceSprites[i],
        scale: 1,
        duration: 200,
        delay: i * 100,
        ease: 'Back.easeOut',
      })
    }

    for (let i = 0; i < defenderDice.length; i++) {
      this.defenderDiceSprites[i].setVisible(true)
      this.defenderDiceSprites[i].setScale(0) // Start small for animation

      // Animate dice appearance
      this.tweens.add({
        targets: this.defenderDiceSprites[i],
        scale: 1,
        duration: 200,
        delay: i * 100 + 300, // Slight delay after attacker dice
        ease: 'Back.easeOut',
      })
    }

    // Animate dice rolling
    let rollCount = 0
    const rollInterval = setInterval(() => {
      rollCount++

      // Show random dice faces during roll animation with rotation
      for (let i = 0; i < attackerDice.length; i++) {
        const randomFace = Math.floor(Math.random() * 6)
        this.attackerDiceSprites[i].setFrame(randomFace)

        // Add a small rotation to make it look like it's tumbling
        this.attackerDiceSprites[i].setAngle(Math.random() * 20 - 10)
      }

      for (let i = 0; i < defenderDice.length; i++) {
        const randomFace = Math.floor(Math.random() * 6)
        this.defenderDiceSprites[i].setFrame(randomFace)

        // Add a small rotation
        this.defenderDiceSprites[i].setAngle(Math.random() * 20 - 10)
      }

      // On the last frame, show the actual results
      if (rollCount >= rollFrames) {
        clearInterval(rollInterval)

        // Add a small delay before showing final results
        this.time.delayedCall(200, () => {
          // Reset rotation
          for (let i = 0; i < attackerDice.length; i++) {
            this.attackerDiceSprites[i].setAngle(0)
          }

          for (let i = 0; i < defenderDice.length; i++) {
            this.defenderDiceSprites[i].setAngle(0)
          }

          this.showDiceResults(attackerDice, defenderDice)
        })
      }
    }, rollDuration / rollFrames)
  }

  showDiceResults(attackerDice: number[], defenderDice: number[]) {
    // Set the actual dice faces (dice values are 1-6, sprite frames are 0-5)
    for (let i = 0; i < attackerDice.length; i++) {
      this.attackerDiceSprites[i].setFrame(attackerDice[i] - 1)

      // a bounce effect when showing final value
      this.tweens.add({
        targets: this.attackerDiceSprites[i],
        y: this.attackerDiceSprites[i].y - 10,
        duration: 150,
        yoyo: true,
        ease: 'Bounce.easeOut',
      })
    }

    for (let i = 0; i < defenderDice.length; i++) {
      this.defenderDiceSprites[i].setFrame(defenderDice[i] - 1)

      // a bounce effect when showing final value
      this.tweens.add({
        targets: this.defenderDiceSprites[i],
        y: this.defenderDiceSprites[i].y - 10,
        duration: 150,
        yoyo: true,
        ease: 'Bounce.easeOut',
      })
    }

    // Compare dice and show results with animation
    const comparisons = []

    for (let i = 0; i < Math.min(attackerDice.length, defenderDice.length); i++) {
      comparisons.push({ index: i, attackerValue: attackerDice[i], defenderValue: defenderDice[i] })
    }

    // Animate results with a staggered delay
    comparisons.forEach((comparison, idx) => {
      const i = comparison.index

      this.time.delayedCall(300 + idx * 400, () => {
        if (comparison.attackerValue > comparison.defenderValue) {
          // Attacker wins
          this.resultIndicators[i].setText('>')
          this.resultIndicators[i].setColor('#00FF00')
          this.defenderDiceSprites[i].setTint(0xff0000) // Red tint for loser

          // Add shake animation to defender's die
          this.tweens.add({
            targets: this.defenderDiceSprites[i],
            x: this.defenderDiceSprites[i].x + 5,
            duration: 50,
            yoyo: true,
            repeat: 3,
            ease: 'Sine.easeInOut',
          })

          // Scale up the result indicator with a nice animation
          this.resultIndicators[i].setScale(0)
          this.tweens.add({
            targets: this.resultIndicators[i],
            scale: 1.5,
            duration: 200,
            ease: 'Back.easeOut',
          })
        } else {
          // Defender wins or ties
          this.resultIndicators[i].setText('<')
          this.resultIndicators[i].setColor('#FF0000')
          this.attackerDiceSprites[i].setTint(0xff0000) // Red tint for loser

          // Add shake animation to attacker's die
          this.tweens.add({
            targets: this.attackerDiceSprites[i],
            x: this.attackerDiceSprites[i].x - 5,
            duration: 50,
            yoyo: true,
            repeat: 3,
            ease: 'Sine.easeInOut',
          })

          // Scale up the result indicator with a nice animation
          this.resultIndicators[i].setScale(0)
          this.tweens.add({
            targets: this.resultIndicators[i],
            scale: 1.5,
            duration: 200,
            ease: 'Back.easeOut',
          })
        }
      })
    })
  }

  fortifyTerritory() {
    if (
      window.gameState.selectedTerritoryId === null ||
      window.gameState.targetTerritoryId === null
    ) {
      return
    }

    const source = this.territoryManager.getTerritory(window.gameState.selectedTerritoryId)
    const destination = this.territoryManager.getTerritory(window.gameState.targetTerritoryId)

    if (!source || !destination) return

    if (source.armies <= 1) {
      this.actionText.setText('Not enough armies to fortify')

      // Reset selections
      this.territoryManager.setTerritorySelected(window.gameState.selectedTerritoryId, false)
      window.gameState.selectedTerritoryId = null
      window.gameState.targetTerritoryId = null
      return
    }

    // Show the army selection UI
    this.createArmySelectionUI(source, destination)
  }

  createArmySelectionUI(source: Territory, destination: Territory) {
    // Background panel with semi-transparent background
    const panel = this.add
      .rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, 400, 300, 0x222222, 0.9)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xffffff)
      .setDepth(1000)

    // Title
    const title = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 100,
        'Select Armies to Move',
        {
          fontSize: '24px',
          color: '#FFF',
          fontStyle: 'bold',
        }
      )
      .setOrigin(0.5)
      .setDepth(1000)

    // Territory info
    const infoText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 60,
        `From ${source.name} (${source.armies} armies) to ${destination.name} (${destination.armies} armies)`,
        {
          fontSize: '16px',
          color: '#FFF',
        }
      )
      .setOrigin(0.5)
      .setDepth(1000)

    // Calculate max armies that can be moved (leaving at least 1 behind)
    const maxArmies = source.armies - 1
    let currentArmies = Math.floor(maxArmies / 2) // Default to half, rounding down

    // Current selection text
    const selectionText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        `Armies to move: ${currentArmies}`,
        {
          fontSize: '20px',
          color: '#FFF',
        }
      )
      .setOrigin(0.5)
      .setDepth(1000)

    // Create minus button
    const minusButton = this.add
      .rectangle(this.cameras.main.width / 2 - 150, this.cameras.main.height / 2, 40, 40, 0x444444)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(1000)

    const minusText = this.add
      .text(this.cameras.main.width / 2 - 150, this.cameras.main.height / 2, '-', {
        fontSize: '24px',
        color: '#FFF',
      })
      .setOrigin(0.5)
      .setDepth(1000)

    // Create plus button
    const plusButton = this.add
      .rectangle(this.cameras.main.width / 2 + 150, this.cameras.main.height / 2, 40, 40, 0x444444)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(1000)

    const plusText = this.add
      .text(this.cameras.main.width / 2 + 150, this.cameras.main.height / 2, '+', {
        fontSize: '24px',
        color: '#FFF',
      })
      .setOrigin(0.5)
      .setDepth(1000)

    // Create slider background
    const sliderBg = this.add
      .rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 200, 20, 0x555555)
      .setOrigin(0.5)
      .setDepth(1000)

    // Create slider handle
    const sliderHandle = this.add
      .rectangle(
        this.cameras.main.width / 2 - 100 + 200 * (currentArmies / maxArmies),
        this.cameras.main.height / 2 + 50,
        20,
        30,
        0xffffff
      )
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(1000)
    sliderHandle.setData('value', currentArmies)

    // Make slider handle draggable
    this.input.setDraggable(sliderHandle)

    // Max and Min labels for slider
    const minLabel = this.add
      .text(this.cameras.main.width / 2 - 110, this.cameras.main.height / 2 + 50, '1', {
        fontSize: '14px',
        color: '#FFF',
      })
      .setOrigin(1, 0.5)
      .setDepth(1000)

    const maxLabel = this.add
      .text(
        this.cameras.main.width / 2 + 110,
        this.cameras.main.height / 2 + 50,
        maxArmies.toString(),
        { fontSize: '14px', color: '#FFF' }
      )
      .setOrigin(0, 0.5)
      .setDepth(1000)

    // Create confirm button
    const confirmButton = this.add
      .rectangle(
        this.cameras.main.width / 2 - 80,
        this.cameras.main.height / 2 + 100,
        120,
        40,
        0x33aa33
      )
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(1000)

    const confirmText = this.add
      .text(this.cameras.main.width / 2 - 80, this.cameras.main.height / 2 + 100, 'Confirm', {
        fontSize: '18px',
        color: '#FFF',
      })
      .setOrigin(0.5)
      .setDepth(1000)

    // Create cancel button
    const cancelButton = this.add
      .rectangle(
        this.cameras.main.width / 2 + 80,
        this.cameras.main.height / 2 + 100,
        120,
        40,
        0xaa3333
      )
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(1000)

    const cancelText = this.add
      .text(this.cameras.main.width / 2 + 80, this.cameras.main.height / 2 + 100, 'Cancel', {
        fontSize: '18px',
        color: '#FFF',
      })
      .setOrigin(0.5)
      .setDepth(1000)

    // Group all UI elements for easy cleanup
    const uiElements = [
      panel,
      title,
      infoText,
      selectionText,
      minusButton,
      minusText,
      plusButton,
      plusText,
      sliderBg,
      sliderHandle,
      minLabel,
      maxLabel,
      confirmButton,
      confirmText,
      cancelButton,
      cancelText,
    ]

    // Function to update the display
    const updateArmySelection = (value: number) => {
      // Constrain to valid range (1 to maxArmies)
      const armiesValue = Math.min(Math.max(1, Math.round(value)), maxArmies)
      currentArmies = armiesValue

      // Update text
      selectionText.setText(`Armies to move: ${armiesValue}`)

      // Update slider position
      const newX = this.cameras.main.width / 2 - 100 + 200 * (armiesValue / maxArmies)
      sliderHandle.x = newX
    }

    // Minus button click
    minusButton.on('pointerdown', () => {
      if (currentArmies > 1) {
        updateArmySelection(currentArmies - 1)
      }
    })

    // Add hover effects for minus button
    minusButton.on('pointerover', () => {
      minusButton.setFillStyle(0x666666)
    })
    minusButton.on('pointerout', () => {
      minusButton.setFillStyle(0x444444)
    })

    // Plus button click
    plusButton.on('pointerdown', () => {
      if (currentArmies < maxArmies) {
        updateArmySelection(currentArmies + 1)
      }
    })

    // Add hover effects for plus button
    plusButton.on('pointerover', () => {
      plusButton.setFillStyle(0x666666)
    })
    plusButton.on('pointerout', () => {
      plusButton.setFillStyle(0x444444)
    })

    // Slider drag
    this.input.on(
      'drag',
      (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Rectangle, dragX: number) => {
        if (gameObject === sliderHandle) {
          // Constrain x position to slider bounds
          const minX = this.cameras.main.width / 2 - 100
          const maxX = this.cameras.main.width / 2 + 100
          const newX = Math.min(Math.max(dragX, minX), maxX)

          // Update position
          gameObject.x = newX

          // Calculate value based on position
          const percentage = (newX - minX) / (maxX - minX)
          const value = Math.max(1, Math.min(Math.round(percentage * maxArmies), maxArmies))

          // Update display
          updateArmySelection(value)
        }
      }
    )

    // Cancel drag when pointer is released
    this.input.on('dragend', () => {
      // This ensures we don't keep dragging after release
    })

    // Confirm button hover effects
    confirmButton.on('pointerover', () => {
      confirmButton.setFillStyle(0x44cc44)
    })
    confirmButton.on('pointerout', () => {
      confirmButton.setFillStyle(0x33aa33)
    })

    // Cancel button hover effects
    cancelButton.on('pointerover', () => {
      cancelButton.setFillStyle(0xcc4444)
    })
    cancelButton.on('pointerout', () => {
      cancelButton.setFillStyle(0xaa3333)
    })

    // Confirm button click - move the armies
    confirmButton.on('pointerdown', () => {
      // Create button press animation
      this.tweens.add({
        targets: confirmButton,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          // Move the armies
          this.territoryManager.removeTerritoryArmies(source.id, currentArmies)
          this.territoryManager.addTerritoryArmies(destination.id, currentArmies)

          this.actionText.setText(
            `Moved ${currentArmies} armies from ${source.name} to ${destination.name}. You cannot fortify again this turn.`
          )

          this.hasFortified = true

          // Clean up UI and event listeners
          this.input.off('drag')
          this.input.off('dragend')
          uiElements.forEach((element) => element.destroy())

          // Reset selections
          this.territoryManager.setTerritorySelected(source.id, false)
          window.gameState.selectedTerritoryId = null
          window.gameState.targetTerritoryId = null
        },
      })
    })

    // Cancel button click
    cancelButton.on('pointerdown', () => {
      // Create button press animation
      this.tweens.add({
        targets: cancelButton,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          // Clean up UI and event listeners
          this.input.off('drag')
          this.input.off('dragend')
          uiElements.forEach((element) => element.destroy())

          // Reset selections
          this.territoryManager.setTerritorySelected(source.id, false)
          window.gameState.selectedTerritoryId = null
          window.gameState.targetTerritoryId = null

          this.actionText.setText('Fortify canceled')
        },
      })
    })

    // Initial setup - start with current value
    updateArmySelection(currentArmies)
  }

  calculateReinforcements(player: Player): number {
    // Base reinforcements from territories
    let reinforcements = Math.max(Math.floor(player.territories.length / 3), 3)

    // Add bonuses for continents
    for (const continent in this.continents) {
      const continentTerritories = this.continents[continent].territories
      const bonus = this.continents[continent].bonus

      // Check if player owns all territories in the continent
      const ownsAll = continentTerritories.every((territoryId) =>
        player.territories.includes(territoryId)
      )

      if (ownsAll) {
        reinforcements += bonus
      }
    }

    return reinforcements
  }

  createPlayerTurnAnimation(playerIndex: number) {
    const player = window.gameState.players[playerIndex]

    // Convert numeric color to hex string
    const colorString = this.hexNumToHexString(player.color)

    // Create the player turn announcement
    const playerText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 40,
        'PLAYER ' + (playerIndex + 1) + "'S TURN",
        {
          fontSize: '52px',
          fontStyle: 'bold',
          color: colorString,
          stroke: '#000000',
          strokeThickness: 6,
          align: 'center',
        }
      )
      .setOrigin(0.5)

    // Create reinforcements text
    const reinforcementsText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 30,
        `Reinforcements: ${player.reinforcements}`,
        {
          fontSize: '32px',
          color: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 4,
          align: 'center',
        }
      )
      .setOrigin(0.5)

    // Set initial properties for animation
    playerText.setAlpha(0)
    playerText.setScale(0.5)
    reinforcementsText.setAlpha(0)
    reinforcementsText.setScale(0.5)

    // Set high depth to appear above everything
    playerText.setDepth(1000)
    reinforcementsText.setDepth(1000)

    // First tween - fade in and scale up
    this.tweens.add({
      targets: [playerText, reinforcementsText],
      alpha: 1,
      scale: 1,
      duration: 800,
      ease: 'Sine.easeOut',
      onComplete: () => {
        // Hold for a moment, then fade out
        this.time.delayedCall(1200, () => {
          // Fade out and scale up more
          this.tweens.add({
            targets: [playerText, reinforcementsText],
            alpha: 0,
            scale: 1.3,
            duration: 500,
            ease: 'Sine.easeIn',
            onComplete: () => {
              playerText.destroy()
              reinforcementsText.destroy()
            },
          })
        })
      },
    })
  }

  checkGameOver() {
    let activePlayers = 0
    let lastActivePlayerIndex = -1

    window.gameState.players.forEach((player, index) => {
      if (!player.eliminated) {
        activePlayers++
        lastActivePlayerIndex = index
      }
    })

    // If only one player remains, they win
    if (activePlayers === 1) {
      this.gameOver(lastActivePlayerIndex)
      return
    }

    // Also check if any player has conquered all territories
    window.gameState.players.forEach((player, index) => {
      if (player.territories.length === territoriesData.length) {
        this.gameOver(index)
      }
    })
  }

  gameOver(winnerIndex: number) {
    // Display game over message
    const overlay = this.add.rectangle(600, 400, 600, 300, 0x000000, 0.8).setDepth(1000)

    // Add fade-in animation for game over screen
    overlay.alpha = 0
    this.tweens.add({
      targets: overlay,
      alpha: 0.8,
      duration: 800,
      ease: 'Power2',
    })

    this.add
      .text(600, 350, 'GAME OVER', {
        fontSize: '48px',
        color: '#FFF',
      })
      .setOrigin(0.5)
      .setDepth(1000)

    this.add
      .text(600, 425, `Player ${winnerIndex + 1} Wins!`, {
        fontSize: '32px',
        color: this.hexNumToHexString(window.gameState.players[winnerIndex].color),
      })
      .setOrigin(0.5)
      .setDepth(1000)

    // Add restart button with animation
    const restartButton = this.add.rectangle(600, 500, 200, 50, 0x444444).setInteractive()
    this.add
      .text(600, 500, 'Play Again', {
        fontSize: '24px',
        color: '#FFF',
      })
      .setOrigin(0.5)
      .setDepth(1000)

    // Add button hover effect
    restartButton.on('pointerover', () => {
      this.tweens.add({
        targets: restartButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        ease: 'Sine.easeOut',
      })
    })

    restartButton.on('pointerout', () => {
      this.tweens.add({
        targets: restartButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: 'Sine.easeOut',
      })
    })

    restartButton.on('pointerdown', () => {
      // Add fade out transition
      this.cameras.main.fadeOut(500, 0, 0, 0)

      // Start MainMenuScene after fade completes
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start('MainMenuScene')
      })
    })
  }

  showPlayerEliminationMessage(playerId: number) {
    const messageBox = this.add.container(600, 400)

    const bg = this.add.rectangle(0, 0, 600, 300, 0x000000, 0.8)
    messageBox.add(bg)

    const message = this.add
      .text(0, -30, `Player ${playerId + 1} Eliminated!`, {
        fontSize: '28px',
        color: this.hexNumToHexString(window.gameState.players[playerId].color),
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
    messageBox.add(message)

    const subtext = this.add
      .text(0, 10, 'Lost all territories and is out of the game', {
        fontSize: '18px',
        color: '#FFFFFF',
      })
      .setOrigin(0.5)
    messageBox.add(subtext)

    const continueButton = this.add.rectangle(0, 60, 160, 40, 0x444444).setInteractive()
    const buttonText = this.add
      .text(0, 60, 'Continue', {
        fontSize: '18px',
        color: '#FFFFFF',
      })
      .setOrigin(0.5)

    messageBox.add(continueButton)
    messageBox.add(buttonText)

    continueButton.on('pointerover', () => continueButton.setFillStyle(0x666666))
    continueButton.on('pointerout', () => continueButton.setFillStyle(0x444444))
    continueButton.on('pointerdown', () => {
      messageBox.destroy()
      // Resume game flow
      this.updateGameInfo()
    })

    messageBox.setDepth(1000)
  }
}
