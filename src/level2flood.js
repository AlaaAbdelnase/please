// Level2Scene.js
import Phaser from 'phaser';

export default class Level2Scene extends Phaser.Scene {
  constructor() {
    super('scene-level2');
  }

  preload() {
    this.load.image('floodedFarm', '/assets/flooded_farm.png');
    this.load.image('hole', '/assets/hole.png');
    this.load.spritesheet('henry', '/assets/henry.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.add.image(350, 250, 'floodedFarm').setScale(2);

    this.henry = this.physics.add.sprite(350, 400, 'henry');
    this.henry.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.holesPlaced = 0;
    this.maxHoles = 5;

    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.holesPlaced < this.maxHoles) {
        const hole = this.add.image(this.henry.x, this.henry.y, 'hole').setScale(0.5);
        this.holesPlaced++;
        if (this.holesPlaced === this.maxHoles) {
          this.time.delayedCall(1000, () => this.scene.start('scene-reward'));
        }
      }
    });
  }

  update() {
    this.henry.setVelocity(0);

    if (this.cursors.left.isDown) this.henry.setVelocityX(-160);
    else if (this.cursors.right.isDown) this.henry.setVelocityX(160);
    if (this.cursors.up.isDown) this.henry.setVelocityY(-160);
    else if (this.cursors.down.isDown) this.henry.setVelocityY(160);
  }
}
