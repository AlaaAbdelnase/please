
import { GameScene } from "./floodintro.js";
import introScene from "./intro.js";
import exploreScene from "./explore.js";
import FloodScene from "./floodGame.js";
import Level1Scene from "./level1flood.js";
import Level2Scene from "./level2flood.js";
import HeatmapScene from "./heatmapScene.js";
import heatGameScene from "./heatGame.js";
import WaterScene from "./waterScene.js";
import waterGame from "./waterGame.js";
import { DroughtScene, PlayScene, ResultScene } from "./drought.js";
import { SalinizedFarmScene } from "./SalinizedFarmScene.js";
import NDVIMapScene from "./NDVImap.js";
import { Game } from "./Start.js";

const gameCanvas = document.getElementById("gameCanvas");
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
  backgroundColor: "#0f0f23",
  input: {
    keyboard: true,
    mouse: true,
    touch: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [
    introScene,
    exploreScene,
    GameScene,
    FloodScene,
    Level1Scene,
    Level2Scene,
    HeatmapScene,
    heatGameScene,
    WaterScene,
    waterGame,
    DroughtScene,
    PlayScene,
    ResultScene,
    SalinizedFarmScene,
    NDVIMapScene,
    Game,
  ],
  pixelArt: true,
};

const game = new Phaser.Game(config);
