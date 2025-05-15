import { ContinentData } from '../types'

export class Player {
  public id: number
  public color: number
  public armies: number
  public territories: number[]
  public reinforcements: number
  public cards: string[]
  public eliminated: boolean

  constructor(id: number, color: number) {
    this.id = id
    this.color = color
    this.armies = 0
    this.territories = []
    this.reinforcements = 0
    this.cards = []
    this.eliminated = false
  }

  // Calculate reinforcements based on territories and continents
  calculateReinforcements(continents: Record<string, ContinentData>): number {
    // Base reinforcements from territories
    let reinforcements = Math.max(Math.floor(this.territories.length / 3), 3)

    // Additional reinforcements from continents
    for (const continent of Object.keys(continents)) {
      const continentTerritories = continents[continent].territories
      const playerOwnsAll = continentTerritories.every((territoryId) =>
        this.territories.includes(territoryId)
      )

      if (playerOwnsAll) {
        reinforcements += continents[continent].bonus
      }
    }

    return reinforcements
  }

  // Add a card to player's hand
  addCard(card: string): void {
    this.cards.push(card)
  }

  // Remove a card from player's hand
  removeCard(cardIndex: number): string | null {
    if (cardIndex >= 0 && cardIndex < this.cards.length) {
      return this.cards.splice(cardIndex, 1)[0]
    }
    return null
  }
}
