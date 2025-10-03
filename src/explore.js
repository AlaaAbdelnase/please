import Phaser from "phaser";
class exploreScene extends Phaser.Scene {
  constructor() {
    super({ key: "exploreScene" });
    this.sceneBoxes = [];
    this.sceneStates = {
      heatmap: true, // All scenes unlocked
      flood: true,
      drought: true,
      salinized: true,
      water: true,
      animals: true,
    };
  }

  preload() {
    // Load static images for each scene
    this.load.image("heatmap_icon", "/assets/heat.png");
    this.load.image("float_icon", "/assets/flood.png");
    this.load.image("drought_icon", "/assets/drought.png");
    this.load.image("salinized_icon", "/assets/placeholder_salinized.png");
    this.load.image("water_icon", "/assets/water.png");
    this.load.image("animals_icon", "/assets/animal.png");

    // Load video for animals scene
    this.load.video("animals_video", "/assets/animal_video.mp4");
    this.load.video("flood_video", "/assets/flood_video.mp4");
    this.load.video("drought_video", "/assets/drought_video.mp4");
    this.load.video("salinized_video", "/assets/salinized_video.mp4");
    this.load.video("water_video", "/assets/water_video.mp4");
    this.load.video("heatmap_video", "/assets/heat_video.mp4");
  }

  create() {
    console.log("Play button clicked!");

    // Set pixel art background similar to heatmap scene
    this.cameras.main.setBackgroundColor(0x2d1810);

    // Add scattered brown patches for pixel art effect
    this.addPixelPatches();

    // Unlock audio context on first user interaction
    this.input.on("pointerdown", () => {
      if (
        this.sound &&
        this.sound.context &&
        this.sound.context.state === "suspended"
      ) {
        this.sound.context.resume();
      }
    });

    // Listen for scene completion events
    this.events.on("sceneComplete", this.onSceneComplete, this);

    this.createTitle();

    // Create 3x2 grid of scene boxes (centered) - bigger size
    const boxWidth = 160;
    const boxHeight = 200;
    const spacingX = 150;
    const spacingY = 50;

    // Calculate center position for 3x2 grid
    const totalWidth = 2 * boxWidth;
    const totalHeight = boxHeight;
    const startX = (this.scale.width - totalWidth) / 4;
    const startY = (this.scale.height - totalHeight) / 4;

    const scenes = [
      {
        key: "heatmap",
        name: "Heat",
        icon: "heatmap_icon",
        animKey: "heatmap_video",
        scene: "HeatmapScene",
      },
      {
        key: "flood",
        name: "Flood",
        icon: "float_icon",
        animKey: "flood_video",
        scene: "scene-game",
      },
      {
        key: "drought",
        name: "Drought",
        icon: "drought_icon",
        animKey: "drought_video",
        scene: "MoistureScene",
      },
      {
        key: "salinized",
        name: "Salinized Soil",
        icon: "salinized_icon",
        animKey: "salinized_video",
        scene: "SalinizedScene",
      },
      {
        key: "water",
        name: "Water Management",
        icon: "water_icon",
        animKey: "water_video",
        scene: "WaterScene",
      },
      {
        key: "animals",
        name: "Animals",
        icon: "animals_icon",
        animKey: "animals_video",
        scene: "AnimalsScene",
      },
    ];

    scenes.forEach((scene, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const x = startX + col * (boxWidth + spacingX) + boxWidth / 2;
      const y = startY + row * (boxHeight + spacingY) + boxHeight / 2;

      this.createSceneBox(x, y, scene, boxWidth, boxHeight);
    });

    // Draw dotted lines connecting scenes in clockwise order
    this.drawConnectingLines(
      scenes,
      startX,
      startY,
      boxWidth,
      boxHeight,
      spacingX,
      spacingY
    );
  }

  createSceneBox(x, y, sceneData, width, height) {
    // Create main box
    const box = this.add.rectangle(x, y, width + 100, height, 0x3d2f1f);
    box.setStrokeStyle(3, 0x8b4513);
    box.setInteractive();
    box.setData("sceneData", sceneData);

    // Create image placeholder - bigger size
    const imageY = y - 20;
    const imageSize = 180; // Increased from 60 to 100

    // Try to load the actual image, fallback to colored rectangle
    let sceneImage;
    try {
      // Use static icon for all scenes
      console.log(
        "Creating scene image with texture:",
        sceneData.icon,
        "for scene:",
        sceneData.name
      );
      sceneImage = this.add.image(x, imageY, sceneData.icon);
      sceneImage.setDisplaySize(imageSize, imageSize);
      console.log("Scene image created successfully");
    } catch (e) {
      console.log("Error creating scene image:", e);
      // Fallback to colored rectangle if image not found
      sceneImage = this.add.rectangle(
        x,
        imageY,
        imageSize,
        imageSize,
        0x8b4513
      );
    }

    // Add pixelated rendering
    sceneImage.setData("originalTexture", sceneData.icon);
    sceneImage.setData("animKey", sceneData.animKey);
    sceneImage.setData("isAnimating", false);

    // Create scene name text
    const nameText = this.add
      .text(x, y + 90, sceneData.name, {
        fontSize: "16px",
        color: "#deb887",
        fontFamily: "'Press Start 2P', Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Create status text - all scenes are available
    const statusText = this.add.text().setOrigin(0.5);

    // Hover effects with sprite sheet animations - all scenes always available
    box.on("pointerover", () => {
      this.tweens.add({
        targets: box,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: "Sine.easeInOut",
      });

      // Start video on hover (for all scenes with videos)
      if (sceneData.animKey) {
        console.log(
          "Starting video for",
          sceneData.name,
          "scene:",
          sceneData.animKey
        );

        // Clean up any existing video first
        if (sceneImage.getData("videoObject")) {
          const existingVideo = sceneImage.getData("videoObject");
          existingVideo.destroy();
          sceneImage.setData("videoObject", null);
        }

        try {
          const video = this.add.video(
            sceneImage.x,
            sceneImage.y,
            sceneData.animKey
          );
          // Individual scaling for each video
          let videoWidth, videoHeight;
          switch (sceneData.key) {
            case "heatmap":
              videoWidth = 65;
              videoHeight = 75;
              break;
            case "flood":
              videoWidth = 110;
              videoHeight = 70;
              break;
            case "drought":
              videoWidth = 145;
              videoHeight = 145;
              break;
            case "salinized":
              videoWidth = 180;
              videoHeight = 180;
              break;
            case "water":
              videoWidth = 160;
              videoHeight = 160;
              break;
            case "animals":
              videoWidth = 240;
              videoHeight = 200;
              break;
            default:
              videoWidth = 180;
              videoHeight = 180;
          }

          video.setDisplaySize(videoWidth, videoHeight);
          video.setMute(true); // Mute videos to avoid autoplay restrictions
          video.play(true); // Loop the video
          video.setData("isVideo", true);
          sceneImage.setVisible(false); // Hide the static image
          sceneImage.setData("videoObject", video);
          sceneImage.setData("isAnimating", true);
          console.log("Video created and playing for", sceneData.name);
        } catch (e) {
          console.log("Video error for", sceneData.name, ":", e);
        }
      }
    });

    box.on("pointerout", () => {
      this.tweens.add({
        targets: box,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: "Sine.easeInOut",
      });

      // Stop video and switch back to static image
      if (sceneImage.getData("isAnimating")) {
        console.log("Stopping video for", sceneData.name, "scene");
        const video = sceneImage.getData("videoObject");
        if (video) {
          video.stop();
          video.destroy();
          console.log("Video stopped and destroyed for", sceneData.name);
        }
        sceneImage.setVisible(true); // Show the static image again
        sceneImage.setData("videoObject", null);
        sceneImage.setData("isAnimating", false);
        console.log("Static image made visible again for", sceneData.name);
      }
    });

    // Click handler - all scenes always available

    box.on("pointerdown", () => {
      const sceneData = box.getData("sceneData");
      console.log(`Clicked on scene: ${sceneData.name}`);

      if (sceneData.scene) {
        this.scene.stop("scene-intro"); // Stop intro
        this.scene.stop("exploreScene"); // Stop explore scene too!
        this.scene.start(sceneData.scene); // Start the game scene
      }
    });

    // Store reference
    this.sceneBoxes.push({
      box,
      sceneData,
      image: sceneImage,
      nameText,
      statusText,
    });
  }

  // Method to be called when returning from a scene (no longer needed for unlocking)
  onSceneComplete(sceneKey) {
    // All scenes are always available now
    console.log(`Completed scene: ${sceneKey}`);
  }

  createTitle() {
    const width = this.sys.game.config.width;

    const titleBg = this.add.rectangle(
      width / 2,
      40,
      width - 60,
      60,
      0x0f3d0f,
      0.9
    );
    titleBg.setStrokeStyle(4, 0x00ff00);
    titleBg.setDepth(15);

    this.titleText = this.add
      .text(width / 2, 40, "CRISIS SCENARIOS", {
        fontSize: "24px",
        fontFamily: "'Press Start 2P', Courier New",
        color: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(15);

    const subtitle = this.add
      .text(width / 2, 62, "A Learning Adventure", {
        fontSize: "10px",
        fontFamily: "Courier New",
        color: "#88ff88",
        fontStyle: "italic",
      })
      .setOrigin(0.5)
      .setDepth(15);

    // Title animation
    this.tweens.add({
      targets: [titleBg, this.titleText, subtitle],
      y: "+=2",
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    // Decorative elements
    this.createTitleDecorations(width);
  }

  createTitleDecorations(width) {
    const leftDecor = this.add.container(100, 40).setDepth(15);
    const rightDecor = this.add.container(width - 100, 40).setDepth(15);

    for (let i = 0; i < 3; i++) {
      // Wheat stalks decoration
      const leftStalk = this.add.rectangle(i * 14, -12, 6, 20, 0xffdd00);
      const leftLeaf = this.add.circle(i * 14, -20, 4, 0x00cc00);
      leftDecor.add([leftStalk, leftLeaf]);

      const rightStalk = this.add.rectangle(-i * 14, -12, 6, 20, 0xffdd00);
      const rightLeaf = this.add.circle(-i * 14, -20, 4, 0x00cc00);
      rightDecor.add([rightStalk, rightLeaf]);
    }

    this.tweens.add({
      targets: [leftDecor, rightDecor],
      angle: 5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }

  addPixelPatches() {
    // Add scattered brown pixel patches for pixel art effect
    const colors = [0x3d2f1f, 0x4a3c2a, 0x5a4a3a, 0x2a1f15];

    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const size = Phaser.Math.Between(2, 8);
      const color = Phaser.Utils.Array.GetRandom(colors);

      this.add.rectangle(x, y, size, size, color);
    }
  }

  drawConnectingLines(
    scenes,
    startX,
    startY,
    boxWidth,
    boxHeight,
    spacingX,
    spacingY
  ) {
    // Calculate center positions for all 6 scenes
    const positions = [];
    scenes.forEach((scene, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const x = startX + col * (boxWidth + spacingX) + boxWidth / 2;
      const y = startY + row * (boxHeight + spacingY) + boxHeight / 2;
      positions.push({ x, y });
    });

    // Define clockwise order: 1st -> 2nd -> 3rd -> 4th -> 5th -> 6th -> 1st
    const clockwiseOrder = [0, 1, 2, 3, 4, 5, 0]; // Last 0 to connect back to first

    // Create graphics object for drawing lines
    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0x8b4513, 0.8); // Brown dotted line

    // Draw dotted lines connecting scenes in clockwise order
    for (let i = 0; i < clockwiseOrder.length - 1; i++) {
      const fromIndex = clockwiseOrder[i];
      const toIndex = clockwiseOrder[i + 1];

      const fromPos = positions[fromIndex];
      const toPos = positions[toIndex];

      // Create dotted line effect
      this.drawDottedLine(graphics, fromPos.x, fromPos.y, toPos.x, toPos.y);
    }
  }

  drawDottedLine(graphics, x1, y1, x2, y2, dashLength = 10, gapLength = 5) {
    const distance = Phaser.Math.Distance.Between(x1, y1, x2, y2);
    const angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);

    const totalLength = dashLength + gapLength;
    const dashCount = Math.floor(distance / totalLength);

    for (let i = 0; i < dashCount; i++) {
      const startRatio = (i * totalLength) / distance;
      const endRatio = (i * totalLength + dashLength) / distance;

      const startX = Phaser.Math.Interpolation.Linear([x1, x2], startRatio);
      const startY = Phaser.Math.Interpolation.Linear([y1, y2], startRatio);
      const endX = Phaser.Math.Interpolation.Linear([x1, x2], endRatio);
      const endY = Phaser.Math.Interpolation.Linear([y1, y2], endRatio);

      graphics.moveTo(startX, startY);
      graphics.lineTo(endX, endY);
    }
  }
}

export default exploreScene;
