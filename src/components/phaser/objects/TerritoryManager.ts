import * as Phaser from 'phaser'
import { Territory } from './Territory'
import { TerritoryState, TerritoryData, Player } from '../types'

export class TerritoryManager {
  private scene: Phaser.Scene
  private territories: Map<number, Territory> = new Map()
  private adjacencyMap: Record<number, number[]>

  constructor(scene: Phaser.Scene, adjacencyMap: Record<number, number[]>) {
    this.scene = scene
    this.adjacencyMap = adjacencyMap
  }

  // Create territory objects from territory data
  createTerritories(territoriesData: TerritoryData[]): void {
    territoriesData.forEach((data) => {
      const territory = new Territory(
        this.scene,
        data.x,
        data.y,
        data.name,
        data.id,
        data.continent,
        (territory) => this.handleTerritoryClick(territory)
      )
      this.territories.set(data.id, territory)
    })
  }

  // Get a territory by ID
  getTerritory(id: number): Territory | undefined {
    return this.territories.get(id)
  }

  // Get all territories
  getAllTerritories(): Territory[] {
    return Array.from(this.territories.values())
  }

  // Handle territory click - delegate to GameScene
  private handleTerritoryClick(territory: Territory): void {
    // This will be set by GameScene
    if (this.onTerritoryClick) {
      this.onTerritoryClick(territory)
    }
  }

  // Set click handler from GameScene
  onTerritoryClick: ((territory: Territory) => void) | null = null

  // Check if territories are adjacent
  areAdjacent(territory1Id: number, territory2Id: number): boolean {
    return this.adjacencyMap[territory1Id].includes(territory2Id)
  }

  // Draw connection lines between territories
  drawConnectionLines(
    graphics: Phaser.GameObjects.Graphics,
    color: number = 0x444444,
    alpha: number = 0.8
  ): void {
    graphics.lineStyle(2, color, alpha)

    // Draw lines between adjacent territories
    this.territories.forEach((territory) => {
      const adjacentIds = this.adjacencyMap[territory.id]

      adjacentIds.forEach((adjacentId) => {
        // Only draw each connection once
        if (adjacentId > territory.id) {
          const adjacentTerritory = this.territories.get(adjacentId)
          if (adjacentTerritory) {
            graphics.lineBetween(territory.x, territory.y, adjacentTerritory.x, adjacentTerritory.y)
          }
        }
      })
    })
  }

  // Set the owner of a territory
  setTerritoryOwner(territoryId: number, player: Player): void {
    const territory = this.territories.get(territoryId)
    if (territory) {
      territory.setOwner(player)
    }
  }

  // Set armies on a territory
  setTerritoryArmies(territoryId: number, count: number): void {
    const territory = this.territories.get(territoryId)
    if (territory) {
      territory.setArmies(count)
    }
  }

  // Add armies to a territory
  addTerritoryArmies(territoryId: number, count: number): void {
    const territory = this.territories.get(territoryId)
    if (territory) {
      territory.addArmies(count)
    }
  }

  // Remove armies from a territory
  removeTerritoryArmies(territoryId: number, count: number): void {
    const territory = this.territories.get(territoryId)
    if (territory) {
      territory.removeArmies(count)
    }
  }

  // Set a territory as selected/deselected
  setTerritorySelected(territoryId: number, selected: boolean): void {
    const territory = this.territories.get(territoryId)
    if (territory) {
      territory.setSelected(selected)
    }
  }

  // Get territory state for all territories
  getTerritoryStates(): TerritoryState[] {
    return Array.from(this.territories.values()).map((territory) => ({
      id: territory.id,
      name: territory.name,
      owner: territory.owner,
      armies: territory.armies,
      continent: territory.continent,
      isSelected: territory.isSelected,
    }))
  }

  // Capture a territory (source attacks target)
  captureTerritory(sourceId: number, targetId: number, moveArmies: number): void {
    const source = this.territories.get(sourceId)
    const target = this.territories.get(targetId)

    if (!source || !target || source.owner === null) {
      return
    }

    // Get players from gameState
    const attackerPlayer = window.gameState.players[source.owner]
    const defenderPlayer = target.owner !== null ? window.gameState.players[target.owner] : null

    if (!attackerPlayer || !defenderPlayer) {
      return
    }

    // Remove territory from defender's list
    if (defenderPlayer) {
      const index = defenderPlayer.territories.indexOf(target.id)
      if (index > -1) {
        defenderPlayer.territories.splice(index, 1)
      }
    }

    // Add territory to attacker's list
    attackerPlayer.territories.push(target.id)

    // Create a capture animation
    this.createCaptureAnimation(target, attackerPlayer)

    // Transfer ownership with delay
    setTimeout(() => {
      target.setOwner(attackerPlayer)
      target.setArmies(moveArmies)
      source.setArmies(source.armies - moveArmies)
    }, 500)
  }

  // Create capture animation
  private createCaptureAnimation(territory: Territory, newOwner: Player): void {
    const flash = this.scene.add.circle(territory.x, territory.y, 50, newOwner.color, 0.7)
    flash.setDepth(300)

    // Add animation for the flash
    this.scene.tweens.add({
      targets: flash,
      radius: 100,
      alpha: 0,
      duration: 800,
      ease: 'Sine.easeOut',
      onComplete: () => {
        flash.destroy()
      },
    })

    // Also make territory briefly glow
    territory.setTint(newOwner.color)

    // Add a scale pulse animation
    this.scene.tweens.add({
      targets: territory.image,
      scaleX: territory.originalScale * 1.3,
      scaleY: territory.originalScale * 1.3,
      duration: 300,
      yoyo: true,
      repeat: 1,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        territory.clearTint()
        territory.setScale(territory.originalScale)
      },
    })
  }
}
