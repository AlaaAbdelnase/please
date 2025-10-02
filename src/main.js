import Phaser from 'phaser';
import {GameScene} from './floodintro.js';
import introScene from './intro.js';
import exploreScene from './explore.js';
import FloodScene from './floodGame.js';
import Level1Scene from './level1flood.js';
import Level2Scene from './level2flood.js';

const gameCanvas = document.getElementById('gameCanvas');
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
   clearBeforeRender: true,
  backgroundColor: '#0f0f23',
   input: {
    keyboard: true,
    mouse: true,
    touch: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [introScene, exploreScene,GameScene,FloodScene, Level1Scene, Level2Scene],
  pixelArt: true
}

const game = new Phaser.Game(config);