import Phaser from "phaser";

export default class WaterGame extends Phaser.Scene {
  constructor() {
    super({ key: "WaterGame" });
    this.gameComplete = false;
    this.selectedFirstRow = null;
    this.matches = [];
    this.correctMatches = [
      { first: 0, second: 1 }, // 1st first row with 2nd second row
      { first: 1, second: 2 }, // 2nd first row with 3rd second row
      { first: 2, second: 0 }, // 3rd first row with 1st second row
    ];
    this.secondRowOrder = [1, 2, 0]; // Fixed pattern for 3 images
    this.images = [
      { key: "mulching", name: "Mulching" },
      { key: "breathe", name: "Breathing" },
      { key: "over_watering", name: "Over Watering" },
    ];
    this.cropImages = [
      { key: "rice", name: "Rice" },
      { key: "corn", name: "Corn" },
      { key: "soybean", name: "Protein Feed" },
    ];
  }

  preload() {
    // Load Brazil statistics image
    this.load.image(
      "brazil_statistics",
      "/assets/alaa's/brazil_statistics.png"
    );

    // Load first row images (situations)
    this.load.image("mulching", "/assets/alaa's/mulching.png");
    this.load.image("breathe", "/assets/alaa's/breathe.png");
    this.load.image("over_watering", "/assets/alaa's/over_watering.png");

    // Load second row images (crops) - using existing working images
    this.load.image("rice", "/assets/alaa's/rice.png");
    this.load.image("corn", "/assets/alaa's/corn.png");
    this.load.image("soybean", "/assets/alaa's/soybean.png");
  }

  create() {
    // Set background similar to game scene
    this.cameras.main.setBackgroundColor(0x2d1810);
    this.addPixelPatches();

    // Set global instance reference
    window.waterGameInstance = this;

    // Reset game state when scene is created/restarted
    this.resetGameState();

    // Use fixed pattern - no randomization
    this.setupFixedPattern();

    // Title
    this.add
      .text(this.scale.width / 2, 50, "Water Management Matching Game", {
        fontSize: "28px",
        color: "#cd853f",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Instructions
    this.add
      .text(
        this.scale.width / 2,
        100,
        "Match the images: Match first row stituations with their best fitted crop using the table!",
        {
          fontSize: "16px",
          color: "#deb887",
          fontFamily: "Courier New",
        }
      )
      .setOrigin(0.5);

    // Add Brazil statistics image in upper right corner
    const brazilImg = this.add.image(
      this.scale.width - 400,
      370,
      "brazil_statistics"
    );
    brazilImg.setDisplaySize(550, 450);
    brazilImg.setOrigin(0.5);

    // Create matching game
    this.createMatchingGame();

    // Create back button
    this.createBackButton();

    // Create feedback text
    this.feedbackText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height - 100,
        "Select an image from the first row",
        {
          fontSize: "18px",
          color: "#deb887",
          fontFamily: "Courier New",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);
  }

  destroy() {
    // Clean up when scene is destroyed
    this.cleanup();
    super.destroy();
  }

  cleanup() {
    // Clear all connection lines
    if (this.connectionLines) {
      this.connectionLines.forEach((line) => {
        if (line && line.destroy) {
          line.destroy();
        }
      });
      this.connectionLines = [];
    }

    if (this.tempLine && this.tempLine.destroy) {
      this.tempLine.destroy();
      this.tempLine = null;
    }

    // Reset global instance reference
    if (window.waterGameInstance === this) {
      window.waterGameInstance = null;
    }
  }

  addPixelPatches() {
    // Add scattered brown pixel patches for pixel art effect (same as mainScene)
    const colors = [0x3d2f1f, 0x4a3c2a, 0x5a4a3a, 0x2a1f15];

    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const size = Phaser.Math.Between(2, 8);
      const color = Phaser.Utils.Array.GetRandom(colors);

      this.add.rectangle(x, y, size, size, color);
    }
  }

  setupFixedPattern() {
    // Use the fixed second row order: [1, 2, 0] for crop images
    // This creates the circular pattern: 1st→2nd, 2nd→3rd, 3rd→1st
    this.correctMatches = [
      { first: 0, second: 1 }, // 1st first row (Mulching) with 2nd second row (Rice)
      { first: 1, second: 2 }, // 2nd first row (Breathing) with 3rd second row (Corn)
      { first: 2, second: 0 }, // 3rd first row (Over Watering) with 1st second row (Wheat)
    ];
  }

  resetGameState() {
    // Reset all game state variables
    this.gameComplete = false;
    this.selectedFirstRow = null;
    this.matches = [];
    this.connectionLines = [];
    this.tempLine = null;
    this.firstRowImages = [];
    this.secondRowImages = [];
  }

  createMatchingGame() {
    const centerX = this.scale.width / 3; // Move left
    const firstRowY = 300;
    const secondRowY = 450;
    const spacing = 150;
    const startX = centerX - spacing * 1.5;

    this.firstRowImages = [];
    this.secondRowImages = [];
    this.connectionLines = []; // Store connection lines

    // Create first row (top row)
    for (let i = 0; i < 3; i++) {
      const x = startX + i * spacing;
      const imageKey = this.images[i].key;

      // Create background rectangle first
      const bg = this.add.rectangle(x, firstRowY, 140, 140, 0x3d2f1f);
      bg.setStrokeStyle(3, 0x8b4513);
      bg.setInteractive();
      bg.setData("index", i);
      bg.setData("row", "first");

      // Create image on top of background
      const image = this.add.image(x, firstRowY, imageKey);
      image.setDisplaySize(120, 120);
      image.setInteractive();
      image.setData("index", i);
      image.setData("row", "first");
      image.setDepth(1); // Ensure image is above background

      // Create label
      this.add
        .text(x, firstRowY + 70, this.images[i].name, {
          fontSize: "12px",
          color: "#deb887",
          fontFamily: "Courier New",
        })
        .setOrigin(0.5);

      // Add click handlers
      image.on("pointerdown", () => this.handleImageClick(i, "first"));
      bg.on("pointerdown", () => this.handleImageClick(i, "first"));

      // Hover effects
      image.on("pointerover", () => {
        image.setTint(0x8b4513);
        bg.setFillStyle(0x4a3c2a);
      });
      image.on("pointerout", () => {
        image.clearTint();
        bg.setFillStyle(0x3d2f1f);
      });

      this.firstRowImages.push({ image, bg, index: i });
    }

    // Create second row (bottom row) - using working images
    for (let i = 0; i < 3; i++) {
      const x = startX + i * spacing;
      const imageIndex = this.secondRowOrder[i];
      const imageKey = this.cropImages[imageIndex].key;

      // Create background rectangle first
      const bg = this.add.rectangle(x, secondRowY, 140, 140, 0x3d2f1f);
      bg.setStrokeStyle(3, 0x8b4513);
      bg.setInteractive();
      bg.setData("index", i);
      bg.setData("row", "second");
      bg.setData("originalIndex", imageIndex);

      // Create image on top of background
      const image = this.add.image(x, secondRowY, imageKey);
      image.setDisplaySize(120, 120);
      image.setInteractive();
      image.setData("index", i);
      image.setData("row", "second");
      image.setData("originalIndex", imageIndex);
      image.setDepth(1); // Ensure image is above background

      // Create label
      this.add
        .text(x, secondRowY + 80, this.cropImages[imageIndex].name, {
          fontSize: "12px",
          color: "#deb887",
          fontFamily: "Courier New",
        })
        .setOrigin(0.5);

      // Add click handlers
      image.on("pointerdown", () => this.handleImageClick(i, "second"));
      bg.on("pointerdown", () => this.handleImageClick(i, "second"));

      // Hover effects
      image.on("pointerover", () => {
        image.setTint(0x8b4513);
        bg.setFillStyle(0x4a3c2a);
      });
      image.on("pointerout", () => {
        image.clearTint();
        bg.setFillStyle(0x3d2f1f);
      });

      this.secondRowImages.push({
        image,
        bg,
        index: i,
        originalIndex: imageIndex,
      });
    }
  }

  handleImageClick(index, row) {
    if (this.gameComplete) return;

    if (row === "first") {
      // Select first row image
      this.selectedFirstRow = index;
      this.clearSelections();
      this.firstRowImages[index].bg.setFillStyle(0x8b4513);
      this.firstRowImages[index].image.setTint(0xcd853f);
      this.feedbackText.setText(
        "Now click the matching image in the second row"
      );
    } else if (row === "second" && this.selectedFirstRow !== null) {
      // Try to match with second row - check circular pattern
      const expectedMatch = this.correctMatches[this.selectedFirstRow];

      // Draw temporary connection line
      this.drawConnectionLine(this.selectedFirstRow, index);

      if (expectedMatch.second === index) {
        // Correct match!
        this.matches.push({ first: this.selectedFirstRow, second: index });
        this.firstRowImages[this.selectedFirstRow].bg.setFillStyle(0x228b22);
        this.secondRowImages[index].bg.setFillStyle(0x228b22);
        this.firstRowImages[this.selectedFirstRow].image.setTint(0x90ee90);
        this.secondRowImages[index].image.setTint(0x90ee90);

        // Make connection line permanent (green)
        this.makeConnectionLinePermanent(this.selectedFirstRow, index);

        this.feedbackText.setText("Correct match! Great job!");

        // Check if all matches are complete
        if (this.matches.length === 3) {
          this.gameComplete = true;
          this.feedbackText.setText(
            "Congratulations! You completed the matching game!"
          );
          setTimeout(() => {
            this.showContinueButton();
          }, 2000);
        } else {
          this.selectedFirstRow = null;
          setTimeout(() => {
            this.feedbackText.setText(
              "Select another image from the first row"
            );
          }, 1500);
        }
      } else {
        // Incorrect match
        this.feedbackText.setText("Incorrect match. Try again!");
        this.secondRowImages[index].bg.setFillStyle(0x8b0000);
        this.secondRowImages[index].image.setTint(0xff6b6b);

        // Make connection line red temporarily
        this.makeConnectionLineRed(this.selectedFirstRow, index);

        setTimeout(() => {
          this.clearSelections();
          this.selectedFirstRow = null;
          this.feedbackText.setText("Select an image from the first row");
        }, 1500);
      }
    }
  }

  drawConnectionLine(firstIndex, secondIndex) {
    // Remove any existing temporary line
    if (this.tempLine) {
      this.tempLine.destroy();
    }

    const firstPos = this.firstRowImages[firstIndex].image;
    const secondPos = this.secondRowImages[secondIndex].image;

    // Create temporary connection line
    this.tempLine = this.add.graphics();
    this.tempLine.lineStyle(4, 0x8b4513, 0.8);
    this.tempLine.beginPath();
    this.tempLine.moveTo(firstPos.x, firstPos.y + 50);
    this.tempLine.lineTo(secondPos.x, secondPos.y - 50);
    this.tempLine.strokePath();
  }

  makeConnectionLinePermanent(firstIndex, secondIndex) {
    // Remove temporary line
    if (this.tempLine) {
      this.tempLine.destroy();
      this.tempLine = null;
    }

    const firstPos = this.firstRowImages[firstIndex].image;
    const secondPos = this.secondRowImages[secondIndex].image;

    // Create permanent green connection line
    const permanentLine = this.add.graphics();
    permanentLine.lineStyle(4, 0x228b22, 1);
    permanentLine.beginPath();
    permanentLine.moveTo(firstPos.x, firstPos.y + 50);
    permanentLine.lineTo(secondPos.x, secondPos.y - 50);
    permanentLine.strokePath();

    this.connectionLines.push(permanentLine);
  }

  makeConnectionLineRed(firstIndex, secondIndex) {
    // Remove temporary line
    if (this.tempLine) {
      this.tempLine.destroy();
    }

    const firstPos = this.firstRowImages[firstIndex].image;
    const secondPos = this.secondRowImages[secondIndex].image;

    // Create red connection line
    this.tempLine = this.add.graphics();
    this.tempLine.lineStyle(4, 0x8b0000, 1);
    this.tempLine.beginPath();
    this.tempLine.moveTo(firstPos.x, firstPos.y + 50);
    this.tempLine.lineTo(secondPos.x, secondPos.y - 50);
    this.tempLine.strokePath();

    // Remove red line after delay
    setTimeout(() => {
      if (this.tempLine) {
        this.tempLine.destroy();
        this.tempLine = null;
      }
    }, 1500);
  }

  clearSelections() {
    // Remove temporary line
    if (this.tempLine) {
      this.tempLine.destroy();
      this.tempLine = null;
    }

    // Reset all first row selections
    this.firstRowImages.forEach((item) => {
      item.bg.setFillStyle(0x3d2f1f);
      item.image.clearTint();
    });

    // Reset all second row selections (except completed matches)
    this.secondRowImages.forEach((item, index) => {
      const isMatched = this.matches.some((match) => match.second === index);
      if (!isMatched) {
        item.bg.setFillStyle(0x3d2f1f);
        item.image.clearTint();
      }
    });
  }

  showContinueButton() {
    const continueBtn = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height - 50,
      200,
      40,
      0x228b22
    );
    continueBtn.setStrokeStyle(3, 0x90ee90);
    continueBtn.setInteractive();

    const continueText = this.add
      .text(this.scale.width / 2, this.scale.height - 50, "Continue", {
        fontSize: "16px",
        color: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    continueBtn.on("pointerdown", () => {
      this.returnToWaterScene();
    });

    // Hover effects
    continueBtn.on("pointerover", () => {
      continueBtn.setFillStyle(0x32cd32);
    });
    continueBtn.on("pointerout", () => {
      continueBtn.setFillStyle(0x228b22);
    });
  }

  returnToWaterScene() {
    // Return to water scene
    this.scene.start("WaterScene");
  }

  createBackButton() {
    const backBtn = this.add.rectangle(50, 50, 120, 40, 0x3d2f1f);
    backBtn.setStrokeStyle(3, 0x8b4513);
    backBtn.setInteractive();

    const backText = this.add
      .text(50, 50, "← Back", {
        fontSize: "14px",
        color: "#deb887",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Hover effects
    backBtn.on("pointerover", () => {
      this.tweens.add({
        targets: backBtn,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: "Power2",
      });
      backBtn.setFillStyle(0x4a3c2a);
    });

    backBtn.on("pointerout", () => {
      this.tweens.add({
        targets: backBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: "Power2",
      });
      backBtn.setFillStyle(0x3d2f1f);
    });

    // Click handler
    backBtn.on("pointerdown", () => {
      this.returnToWaterScene();
    });
  }
}

// Make instance available globally for the continue button
window.waterGameInstance = null;
