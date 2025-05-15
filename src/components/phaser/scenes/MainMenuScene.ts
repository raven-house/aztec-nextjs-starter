import * as Phaser from 'phaser'

const instructions: string[] = [
  'How to Play:',
  '1. Place your armies on territories.',
  '2. Attack adjacent enemy territories.',
  '3. Fortify your position by moving armies to any owned territory.',
  '4. Capture all territories to win!',
]

export class MainMenuScene extends Phaser.Scene {
  private buttonHoverSound!: Phaser.Sound.BaseSound
  private buttonClickSound!: Phaser.Sound.BaseSound

  constructor() {
    super({ key: 'MainMenuScene' })
  }

  create(): void {
    // dark background with gradient
    this.buttonHoverSound = this.sound.add('button-hover')
    this.buttonClickSound = this.sound.add('button-click')

    this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000
    )

    // Add a subtle moving gradient background
    const gradient = this.add.graphics()
    gradient.fillGradientStyle(0x001133, 0x001133, 0x002266, 0x002266, 1)
    gradient.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height)

    // Title with animation
    const titleText = this.add
      .text(this.cameras.main.width / 2, 100, 'FOG OF NOIR', {
        fontSize: '64px',
        color: '#FFF',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 8,
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: titleText,
      y: { from: 50, to: 100 },
      alpha: { from: 0, to: 1 },
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        //  subtle floating animation
        this.tweens.add({
          targets: titleText,
          y: '+=10',
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      },
    })

    // Player selection text with fade-in
    const selectionText = this.add
      .text(this.cameras.main.width / 2, 200, 'Select number of players:', {
        fontSize: '24px',
        color: '#FFF',
      })
      .setOrigin(0.5)
      .setAlpha(0)

    this.tweens.add({
      targets: selectionText,
      alpha: 1,
      duration: 800,
      delay: 300,
      ease: 'Power2',
    })

    // player number selection buttons with staggered animation
    const buttonStyle = {
      fontSize: '20px',
      fill: '#000',
      fontStyle: 'bold',
    }

    for (let i = 2; i <= 6; i++) {
      const button = this.add
        .rectangle(this.cameras.main.width / 2 - 250 + (i - 2) * 100, 250, 80, 40, 0x33aa33)
        .setInteractive()

      const text = this.add
        .text(this.cameras.main.width / 2 - 250 + (i - 2) * 100, 250, `${i}`, buttonStyle)
        .setOrigin(0.5)

      button.on('pointerdown', () => {
        this.buttonClickSound.play()
        this.setupPlayers(i)
        this.scene.start('GameScene')
      })

      button.on('pointerover', () => {
        this.buttonHoverSound.play({ volume: 0.5 })
        button.setFillStyle(0x44cc44)

        this.tweens.add({
          targets: [button, text],
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 100,
          ease: 'Sine.easeOut',
        })
      })

      button.on('pointerout', () => {
        button.setFillStyle(0x33aa33)

        // Reset scale on hover out
        this.tweens.add({
          targets: [button, text],
          scaleX: 1,
          scaleY: 1,
          duration: 100,
          ease: 'Sine.easeOut',
        })
      })
    }

    const instructionTextObjects: Phaser.GameObjects.Text[] = []

    for (let i = 0; i < instructions.length; i++) {
      const text = this.add
        .text(this.cameras.main.width / 2, 350 + i * 30, instructions[i], {
          fontSize: '18px',
          color: '#FFF',
        })
        .setOrigin(0.5)
        .setAlpha(0)

      instructionTextObjects.push(text)
    }

    // Animate instructions appearing with stagger
    this.tweens.add({
      targets: instructionTextObjects,
      alpha: 1,
      x: { from: this.cameras.main.width / 2 - 50, to: this.cameras.main.width / 2 },
      duration: 500,
      delay: function (i: number) {
        return 800 + i * 200
      },
      ease: 'Power2',
    })
  }

  setupPlayers(numPlayers: number): void {
    // Clear existing Players
    window.gameState.players = []

    // Player colors
    const colors = [0xcf402e, 0x2ca5c7, 0x96c72c, 0xc7b52c, 0xb52cc7, 0x00ffff]

    // Create players
    for (let i = 0; i < numPlayers; i++) {
      window.gameState.players.push({
        id: i,
        color: colors[i],
        armies: 0,
        territories: [],
        reinforcements: 0,
        eliminated: false,
      })
    }

    // Reset game state
    window.gameState.currentPlayerIndex = 0
    window.gameState.gamePhase = 'initialPlacement'
  }
}
