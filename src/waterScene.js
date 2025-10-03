import Phaser from "phaser";

export default class WaterScene extends Phaser.Scene {
  constructor() {
    super({ key: "WaterScene" });
  }

  preload() {
    // Load images for tutorials
    this.load.image("co2", "/assets/alaa's/co2.png");
    this.load.image("adaption", "/assets/alaa's/adaption.png");
    this.load.image("ai", "/assets/alaa's/ai.png");
    this.load.image("produce_co2", "/assets/alaa's/produce_co2.png");
    this.load.image("air_co2", "/assets/alaa's/air_co2.png");
    this.load.image("pumping_co2", "/assets/alaa's/pumping_co2.png");
    this.load.image("no_adaption", "/assets/alaa's/no_adaption.png");
    this.load.image("level1", "/assets/alaa's/level1.png");
    this.load.image("level2", "/assets/alaa's/level2.png");
  }

  create() {
    // Set pixel art background similar to mainScene
    this.cameras.main.setBackgroundColor(0x2d1810);
    this.addPixelPatches();

    // Title
    this.add
      .text(this.scale.width / 2, 50, "Water Management", {
        fontSize: "28px",
        color: "#cd853f",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Create 3 tutorial buttons
    this.createTutorialButtons();

    // Add back button
    this.createBackButton();

    // Add "Try Your Info" button
    this.createTryInfoButton();
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

  createTutorialButtons() {
    // Button positions
    const buttonY = this.scale.height / 2;
    const button1X = this.scale.width / 4;
    const button2X = this.scale.width / 2;
    const button3X = (this.scale.width * 3) / 4;

    // Button 1: CO2 for Plants
    this.createTutorialButton(
      button1X,
      buttonY,
      "CO2 for Plants",
      ["produce_co2", "air_co2", "pumping_co2"],
      ["Produce CO2", "Air CO2", "Pumping CO2"],
      "co2"
    );

    // Button 2: Adapting Levels
    this.createTutorialButton(
      button2X,
      buttonY,
      "Adapting Levels",
      ["no_adaption", "level1", "level2"],
      ["No Adaption", "Level 1", "Level 2"],
      "adaption"
    );

    // Button 3: AI Model
    this.createAIPredictionButton(button3X, buttonY, "AI Prediction", "ai");
  }

  createTutorialButton(x, y, title, images, titles, iconImage = null) {
    // Create bigger button
    const button = this.add.rectangle(x, y, 320, 360, 0x3d2f1f);
    button.setStrokeStyle(4, 0x8b4513);
    button.setInteractive();

    // Add icon image if provided
    if (iconImage) {
      try {
        const icon = this.add.image(x, y - 30, iconImage);
        icon.setDisplaySize(280, 280);
      } catch (e) {
        // Fallback to colored rectangle if image not found
        this.add.rectangle(x, y - 30, 120, 120, 0x5a4a3a);
      }
    }

    // Add button title
    this.add
      .text(x, y + 135, title, {
        fontSize: "18px",
        color: "#deb887",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Add click handler
    button.on("pointerdown", () => {
      this.openTutorial(title, images, titles);
    });

    // Hover effects
    button.on("pointerover", () => {
      button.setFillStyle(0x4a3c2a);
    });

    button.on("pointerout", () => {
      button.setFillStyle(0x3d2f1f);
    });
  }

  createAIPredictionButton(x, y, title, iconImage) {
    // Create bigger button
    const button = this.add.rectangle(x, y, 320, 360, 0x3d2f1f);
    button.setStrokeStyle(4, 0x8b4513);
    button.setInteractive();

    // Add icon image if provided
    if (iconImage) {
      try {
        const icon = this.add.image(x, y - 30, iconImage);
        icon.setDisplaySize(280, 280);
      } catch (e) {
        // Fallback to colored rectangle if image not found
        this.add.rectangle(x, y - 30, 120, 120, 0x5a4a3a);
      }
    }

    // Add button title
    this.add
      .text(x, y + 135, title, {
        fontSize: "18px",
        color: "#deb887",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Add click handler
    button.on("pointerdown", () => {
      this.openAIPredictionInterface();
    });

    // Hover effects
    button.on("pointerover", () => {
      button.setFillStyle(0x4a3c2a);
    });

    button.on("pointerout", () => {
      button.setFillStyle(0x3d2f1f);
    });
  }

  openTutorial(title, images, titles) {
    // Create modal overlay
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(45, 24, 16, 0.95);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      font-family: 'Courier New', monospace;
    `;

    // Create tutorial window
    const tutorialWindow = document.createElement("div");
    tutorialWindow.style.cssText = `
      background: #2d1810;
      border: 4px solid #8b4513;
      border-radius: 0px;
      padding: 40px;
      width: 90vw;
      height: 85vh;
      max-width: 1400px;
      max-height: 900px;
      position: relative;
      color: #deb887;
      display: flex;
      flex-direction: column;
    `;

    // Tutorial content
    let currentStep = 0;

    // Title
    const titleEl = document.createElement("h2");
    titleEl.textContent = title;
    titleEl.style.cssText = `
      color: #cd853f;
      text-align: center;
      margin-bottom: 20px;
      font-family: 'Courier New', monospace;
    `;

    // Image container
    const imageContainer = document.createElement("div");
    imageContainer.style.cssText = `
      text-align: center;
      margin: 30px 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    `;

    // Step title
    const stepTitle = document.createElement("h3");
    stepTitle.style.cssText = `
      color: #deb887;
      text-align: center;
      margin-bottom: 10px;
    `;

    // Image element
    const imageEl = document.createElement("img");
    imageEl.style.cssText = `
      width: 100%;
      height: 100%;
      max-width: 800px;
      max-height: 500px;
      border: 4px solid #8b4513;
      object-fit: contain;
      background: #3d2f1f;
      border-radius: 8px;
    `;

    // Navigation buttons
    const navContainer = document.createElement("div");
    navContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    `;

    // Back button
    const backBtn = document.createElement("button");
    backBtn.textContent = "← Back";
    backBtn.style.cssText = `
      background: #3d2f1f;
      color: #deb887;
      border: 2px solid #8b4513;
      padding: 8px 16px;
      font-family: 'Courier New', monospace;
      cursor: pointer;
    `;

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next →";
    nextBtn.style.cssText = `
      background: #3d2f1f;
      color: #deb887;
      border: 2px solid #8b4513;
      padding: 8px 16px;
      font-family: 'Courier New', monospace;
      cursor: pointer;
    `;

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      color: #cd853f;
      font-size: 20px;
      cursor: pointer;
      font-family: 'Courier New', monospace;
    `;

    // Update display function
    const updateDisplay = () => {
      stepTitle.textContent = titles[currentStep];
      imageEl.src = `/assets/alaa's/${images[currentStep]}.png`;
      imageEl.alt = titles[currentStep];
      backBtn.disabled = currentStep === 0;
      nextBtn.disabled = currentStep === images.length - 1;
      backBtn.style.opacity = currentStep === 0 ? "0.5" : "1";
      nextBtn.style.opacity = currentStep === images.length - 1 ? "0.5" : "1";
    };

    // Event listeners
    backBtn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        updateDisplay();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentStep < images.length - 1) {
        currentStep++;
        updateDisplay();
      }
    });

    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    // Assemble modal
    imageContainer.appendChild(stepTitle);
    imageContainer.appendChild(imageEl);
    navContainer.appendChild(backBtn);
    navContainer.appendChild(nextBtn);

    tutorialWindow.appendChild(closeBtn);
    tutorialWindow.appendChild(titleEl);
    tutorialWindow.appendChild(imageContainer);
    tutorialWindow.appendChild(navContainer);

    modal.appendChild(tutorialWindow);
    document.body.appendChild(modal);

    // Initialize display
    updateDisplay();
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
      this.scene.start("MainScene");
    });
  }

  createTryInfoButton() {
    // Position in bottom right corner
    const tryInfoBtn = this.add.rectangle(
      this.scale.width - 120,
      this.scale.height - 60,
      200,
      50,
      0x3d2f1f
    );
    tryInfoBtn.setStrokeStyle(3, 0x8b4513);
    tryInfoBtn.setInteractive();

    const tryInfoText = this.add
      .text(this.scale.width - 120, this.scale.height - 60, "Try Your Info", {
        fontSize: "16px",
        color: "#deb887",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Hover effects
    tryInfoBtn.on("pointerover", () => {
      this.tweens.add({
        targets: tryInfoBtn,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: "Power2",
      });
      tryInfoBtn.setFillStyle(0x4a3c2a);
    });

    tryInfoBtn.on("pointerout", () => {
      this.tweens.add({
        targets: tryInfoBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: "Power2",
      });
      tryInfoBtn.setFillStyle(0x3d2f1f);
    });

    // Click handler - navigate to water game
    tryInfoBtn.on("pointerdown", () => {
      this.scene.start("WaterGame");
    });
  }

  openAIPredictionInterface() {
    // Check if modal already exists
    const existingModal = document.getElementById("aiPredictionModal");
    if (existingModal) {
      return; // Don't create multiple modals
    }

    // Create modal overlay with higher z-index to avoid conflicts
    const modal = document.createElement("div");
    modal.id = "aiPredictionModal";
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(45, 24, 16, 0.95);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      font-family: 'Courier New', monospace;
    `;

    // Create AI prediction window
    const aiWindow = document.createElement("div");
    aiWindow.style.cssText = `
      background: #2d1810;
      border: 4px solid #8b4513;
      border-radius: 0px;
      padding: 40px;
      width: 90vw;
      height: 85vh;
      max-width: 1200px;
      max-height: 800px;
      position: relative;
      color: #deb887;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    `;

    // Title
    const titleEl = document.createElement("h2");
    titleEl.textContent = "AI Crop Prediction Model";
    titleEl.style.cssText = `
      color: #cd853f;
      text-align: center;
      margin-bottom: 30px;
      font-family: 'Courier New', monospace;
      font-size: 24px;
    `;

    // Form container
    const formContainer = document.createElement("div");
    formContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 25px;
      flex: 1;
    `;

    // Country selection
    const countryGroup = document.createElement("div");
    countryGroup.innerHTML = `
      <label style="color: #deb887; font-size: 18px; font-weight: bold; margin-bottom: 10px; display: block;">
        Select Country:
      </label>
      <select id="countrySelect" style="
        background: #3d2f1f;
        color: #deb887;
        border: 2px solid #8b4513;
        padding: 10px;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        width: 100%;
        border-radius: 4px;
      ">
        <option value="">Choose a country...</option>
        <option value="Kenya">Kenya</option>
        <option value="Japan">Japan</option>
        <option value="Indonesia">Indonesia</option>
        <option value="India">India</option>
        <option value="Turkey">Turkey</option>
        <option value="Thailand">Thailand</option>
        <option value="Egypt">Egypt</option>
        <option value="EU">EU</option>
        <option value="China">China</option>
        <option value="USA">USA</option>
        <option value="Brazil">Brazil</option>
      </select>
    `;

    // Time slice selection
    const timeGroup = document.createElement("div");
    timeGroup.innerHTML = `
      <label style="color: #deb887; font-size: 18px; font-weight: bold; margin-bottom: 10px; display: block;">
        Enter Year:
      </label>
      <input type="number" id="timeSelect" placeholder="Enter year (e.g., 2020, 2050, 2080, 2110)" min="2020" max="2200" style="
        background: #3d2f1f;
        color: #deb887;
        border: 2px solid #8b4513;
        padding: 10px;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        width: 100%;
        border-radius: 4px;
        box-sizing: border-box;
      ">
    `;

    // CO2 effects toggle
    const co2Group = document.createElement("div");
    co2Group.innerHTML = `
      <label style="color: #deb887; font-size: 18px; font-weight: bold; margin-bottom: 10px; display: block;">
        CO2 Effects:
      </label>
      <div style="display: flex; gap: 20px; margin-top: 10px;">
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="radio" name="co2Effects" value="Yes" style="accent-color: #8b4513;">
          <span style="color: #deb887; font-size: 16px;">Yes</span>
        </label>
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="radio" name="co2Effects" value="No" style="accent-color: #8b4513;">
          <span style="color: #deb887; font-size: 16px;">No</span>
        </label>
      </div>
    `;

    // Adaptation level
    const adaptationGroup = document.createElement("div");
    adaptationGroup.innerHTML = `
      <label style="color: #deb887; font-size: 18px; font-weight: bold; margin-bottom: 10px; display: block;">
        Adaptation Level:
      </label>
      <select id="adaptationSelect" style="
        background: #3d2f1f;
        color: #deb887;
        border: 2px solid #8b4513;
        padding: 10px;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        width: 100%;
        border-radius: 4px;
      ">
        <option value="">Choose adaptation level...</option>
        <option value="No Adaptation">No Adaptation</option>
        <option value="Level 1">Level 1</option>
        <option value="Level 2">Level 2</option>
      </select>
    `;

    // Predict button
    const predictBtn = document.createElement("button");
    predictBtn.textContent = "Get AI Prediction";
    predictBtn.style.cssText = `
      background: #8b4513;
      color: #deb887;
      border: 2px solid #cd853f;
      padding: 15px 30px;
      font-family: 'Courier New', monospace;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;
      margin-top: 20px;
      align-self: center;
      transition: all 0.3s ease;
    `;

    // Results container
    const resultsContainer = document.createElement("div");
    resultsContainer.id = "aiResults";
    resultsContainer.style.cssText = `
      margin-top: 30px;
      padding: 20px;
      background: #3d2f1f;
      border: 2px solid #8b4513;
      border-radius: 4px;
      display: none;
    `;

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      color: #cd853f;
      font-size: 20px;
      cursor: pointer;
      font-family: 'Courier New', monospace;
    `;

    // Event handlers
    predictBtn.addEventListener("click", () => {
      this.getAIPrediction();
    });

    predictBtn.addEventListener("mouseover", () => {
      predictBtn.style.background = "#cd853f";
      predictBtn.style.borderColor = "#8b4513";
    });

    predictBtn.addEventListener("mouseout", () => {
      predictBtn.style.background = "#8b4513";
      predictBtn.style.borderColor = "#cd853f";
    });

    closeBtn.addEventListener("click", () => {
      const existingModal = document.getElementById("aiPredictionModal");
      if (existingModal) {
        document.body.removeChild(existingModal);
      }
    });

    // Assemble the interface
    formContainer.appendChild(countryGroup);
    formContainer.appendChild(timeGroup);
    formContainer.appendChild(co2Group);
    formContainer.appendChild(adaptationGroup);
    formContainer.appendChild(predictBtn);
    formContainer.appendChild(resultsContainer);

    aiWindow.appendChild(closeBtn);
    aiWindow.appendChild(titleEl);
    aiWindow.appendChild(formContainer);

    modal.appendChild(aiWindow);
    document.body.appendChild(modal);
  }

  getAIPrediction() {
    const country = document.getElementById("countrySelect").value;
    const timeSlice = document.getElementById("timeSelect").value;
    const co2Effects = document.querySelector(
      'input[name="co2Effects"]:checked'
    )?.value;
    const adaptation = document.getElementById("adaptationSelect").value;
    const resultsContainer = document.getElementById("aiResults");

    // Validate inputs
    if (!country || !timeSlice || !co2Effects || !adaptation) {
      alert("Please fill in all fields!");
      return;
    }

    // Show loading
    resultsContainer.style.display = "block";
    resultsContainer.innerHTML = `
      <h3 style="color: #cd853f; text-align: center; margin-bottom: 15px;">Loading AI Prediction...</h3>
      <div style="text-align: center; color: #deb887;">Please wait while our AI model processes your request...</div>
    `;

    // Simulate AI prediction (replace with actual API call)
    setTimeout(() => {
      this.displayAIPrediction(country, timeSlice, co2Effects, adaptation);
      // Auto-scroll to results
      resultsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 2000);
  }

  displayAIPrediction(country, timeSlice, co2Effects, adaptation) {
    const resultsContainer = document.getElementById("aiResults");

    // Simulate prediction results (replace with actual AI model results)
    const predictions = {
      wheat: (Math.random() * 20 - 10).toFixed(1),
      rice: (Math.random() * 20 - 10).toFixed(1),
      "coarse grains": (Math.random() * 20 - 10).toFixed(1),
      "protein feed": (Math.random() * 20 - 10).toFixed(1),
    };

    // Calculate prediction accuracy (simulated)
    const accuracy = (85 + Math.random() * 10).toFixed(1); // 85-95% accuracy

    resultsContainer.innerHTML = `
      <h3 style="color: #cd853f; text-align: center; margin-bottom: 20px;">AI Prediction Results</h3>
      <div style="margin-bottom: 15px;">
        <strong style="color: #deb887;">Country:</strong> <span style="color: #cd853f;">${country}</span><br>
        <strong style="color: #deb887;">Time Period:</strong> <span style="color: #cd853f;">${timeSlice}</span><br>
        <strong style="color: #deb887;">CO2 Effects:</strong> <span style="color: #cd853f;">${co2Effects}</span><br>
        <strong style="color: #deb887;">Adaptation Level:</strong> <span style="color: #cd853f;">${adaptation}</span><br>
        <strong style="color: #deb887;">Prediction Accuracy:</strong> <span style="color: #90ee90; font-weight: bold;">${accuracy}%</span>
      </div>
      <div style="background: #2d1810; padding: 15px; border: 2px solid #8b4513; border-radius: 4px;">
        <h4 style="color: #cd853f; margin-bottom: 10px;">Predicted Crop Yield Changes (%):</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="color: #deb887;">Wheat: <span style="color: ${
            predictions.wheat >= 0 ? "#90ee90" : "#ff6b6b"
          };">${predictions.wheat}%</span></div>
          <div style="color: #deb887;">Rice: <span style="color: ${
            predictions.rice >= 0 ? "#90ee90" : "#ff6b6b"
          };">${predictions.rice}%</span></div>
          <div style="color: #deb887;">Coarse Grains: <span style="color: ${
            predictions["coarse grains"] >= 0 ? "#90ee90" : "#ff6b6b"
          };">${predictions["coarse grains"]}%</span></div>
          <div style="color: #deb887;">Protein Feed: <span style="color: ${
            predictions["protein feed"] >= 0 ? "#90ee90" : "#ff6b6b"
          };">${predictions["protein feed"]}%</span></div>
        </div>
      </div>
      <div style="margin-top: 15px; text-align: center;">
        <button onclick="this.parentElement.parentElement.style.display='none'" style="
          background: #3d2f1f;
          color: #deb887;
          border: 2px solid #8b4513;
          padding: 8px 16px;
          font-family: 'Courier New', monospace;
          cursor: pointer;
          border-radius: 4px;
        ">Clear Results</button>
      </div>
    `;
  }
}
