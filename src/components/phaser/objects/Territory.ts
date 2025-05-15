import * as Phaser from 'phaser'
import { TerritoryState, Player } from '../types'

export class Territory implements TerritoryState {
  public id: number
  public name: string
  public owner: number | null
  public armies: number
  public isSelected: boolean
  public continent: string
  public originalScale: number

  // Visual components
  public image: Phaser.GameObjects.Image
  public nameText: Phaser.GameObjects.Text
  public armiesText: Phaser.GameObjects.Text

  // Position properties (for easier access)
  public x: number
  public y: number

  private scene: Phaser.Scene
  private hoverTween: Phaser.Tweens.Tween | null = null
  private onClickCallback: (territory: Territory) => void

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: string,
    id: number,
    continent: string,
    onClick: (territory: Territory) => void
  ) {
    this.scene = scene
    this.id = id
    this.name = name
    this.owner = null
    this.armies = 0
    this.isSelected = false
    this.continent = continent
    this.originalScale = 0.6
    this.x = x
    this.y = y
    this.onClickCallback = onClick

    // Create visual elements
    this.image = scene.add.image(x, y, `territory-${id}-neutral`)
    this.image.setInteractive()
    this.image.setScale(this.originalScale)
    this.image.setDepth(1)

    // Set up interaction events
    this.setupInteractions()

    // Create text elements
    this.nameText = scene.add
      .text(x - 10, y - 15, name, {
        fontSize: '12px',
        color: '#FFF',
        stroke: '#000',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(1)

    this.armiesText = scene.add
      .text(x, y, '0', {
        fontSize: '16px',
        color: '#FFF',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(1)
  }

  private setupInteractions(): void {
    this.image.on('pointerdown', () => {
      this.onClickCallback(this)
    })

    this.image.on('pointerover', () => {
      if (!this.isSelected) {
        this.image.setDepth(105)
        this.nameText.setDepth(105)
        this.armiesText.setDepth(105)

        this.image.setScale(this.originalScale * 1.1)

        if (this.hoverTween) {
          this.hoverTween.stop()
        }

        this.hoverTween = this.scene.tweens.add({
          targets: this.image,
          scale: this.originalScale * 1.15,
          duration: 100,
          yoyo: true,
          ease: 'Sine.easeOut',
          onComplete: () => {
            // Ensure scale is correct when tween completes
            if (!this.isSelected) {
              this.image.setScale(this.originalScale * 1.1)
            }
          },
        })

        this.nameText.setScale(1.15)
        this.armiesText.setScale(1.15)
      }
    })

    this.image.on('pointerout', () => {
      if (!this.isSelected) {
        this.armiesText.setDepth(0)
        this.nameText.setDepth(0)
        this.image.setDepth(0)

        if (this.hoverTween) {
          this.hoverTween.stop()
          this.hoverTween = null
        }

        this.image.clearTint()
        this.image.setScale(this.originalScale)

        this.nameText.setScale(1)
        this.armiesText.setScale(1)
      }
    })
  }

  setOwner(player: Player): void {
    this.owner = player.id
    // Color name mapping for territory textures
    const colorNames = ['red', 'blue', 'green', 'yellow', 'purple']
    const colorName = colorNames[player.id]

    // Each territory has its own unique image for each color
    this.image.setTexture(`territory-${this.id}-${colorName}`)
    this.image.setScale(this.originalScale)
  }

  setArmies(count: number): void {
    this.armies = count
    this.armiesText.setText(count.toString())
  }

  addArmies(count: number): void {
    this.armies += count
    this.updateArmiesWithAnimation(count)
  }

  removeArmies(count: number): void {
    const previousCount = this.armies
    this.armies = Math.max(0, previousCount - count)
    this.updateArmiesWithAnimation(-count)
  }

  setSelected(selected: boolean): void {
    this.isSelected = selected

    // Stop any existing hover tween regardless of selection change
    if (this.hoverTween) {
      this.hoverTween.stop()
      this.hoverTween = null
    }

    if (selected) {
      this.image.setDepth(200)
      this.nameText.setDepth(200)
      this.armiesText.setDepth(200)

      // Scale the territory when selected
      this.image.setScale(this.originalScale * 1.15)

      // Pulsing animation when selected
      this.hoverTween = this.scene.tweens.add({
        targets: this.image,
        scale: { from: this.originalScale * 1.15, to: this.originalScale * 1.25 },
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })

      this.nameText.setScale(1.2)
      this.armiesText.setScale(1.2)
    } else {
      // Reset depth to 0 when deselected
      this.image.setDepth(0)
      this.nameText.setDepth(0)
      this.armiesText.setDepth(0)

      // Remove all effects
      this.image.clearTint()
      this.image.setScale(this.originalScale)

      this.scene.tweens.killTweensOf(this.image)

      this.nameText.setScale(1)
      this.armiesText.setScale(1)
    }
  }

  // Set a tint color
  setTint(color: number): void {
    this.image.setTint(color)
  }

  // Clear tint
  clearTint(): void {
    this.image.clearTint()
  }

  // Set scale directly
  setScale(scale: number): void {
    this.image.setScale(scale)
  }

  private updateArmiesWithAnimation(count: number): void {
    // Update the text display
    this.armiesText.setText(this.armies.toString())

    // Flash effect for the armies counter
    this.scene.tweens.add({
      targets: this.armiesText,
      scale: 1.5,
      duration: 200,
      yoyo: true,
      ease: 'Sine.easeOut',
    })

    // If this is a change, add an indicator animation
    if (count !== 0) {
      // Set the sign and color based on whether we're adding or removing
      const sign = count > 0 ? '+' : '-'
      const color = count > 0 ? '#FFFFFF' : '#FF0000'

      const changeText = this.scene.add
        .text(this.x + 20, this.y - 20, sign + Math.abs(count), {
          fontSize: '24px',
          fontStyle: 'bold',
          color: color,
          stroke: '#000000',
          strokeThickness: 3,
        })
        .setOrigin(0.5)
        .setDepth(1000)

      // Animate the text
      this.scene.tweens.add({
        targets: changeText,
        y: this.y - 100,
        alpha: 0,
        duration: 1500,
        ease: 'Power2',
        onComplete: () => {
          changeText.destroy()
        },
      })
    }

    // Create a territory animation - different based on adding vs removing
    if (count > 0) {
      // Pulsing effect for adding armies
      this.scene.tweens.add({
        targets: this.image,
        scale: this.originalScale * 1.1,
        duration: 100,
        yoyo: true,
        repeat: 1,
        ease: 'Sine.easeInOut',
      })
    } else if (count < 0) {
      // Set red tint for army loss
      this.armiesText.setTint(0xff0000)

      this.scene.tweens.add({
        targets: this.armiesText,
        scale: 1.3,
        duration: 200,
        yoyo: true,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          // Reset tint after animation
          this.armiesText.clearTint()
        },
      })

      // Shake animation for damage
      this.scene.tweens.add({
        targets: this.image,
        x: this.x + 3,
        duration: 50,
        yoyo: true,
        repeat: 2,
        ease: 'Sine.easeInOut',
      })
    }
  }
}
