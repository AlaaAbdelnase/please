# NASA Farming Game

An interactive educational game about climate change impacts on farming, developed with Phaser.js.

## 🌱 About

This game educates players about various environmental challenges affecting agriculture, including:

- Heat stress and crop adaptation
- Flooding and water management
- Drought conditions
- Soil salinization
- Crop management techniques

## 🎮 Features

- Interactive tutorial system with Brazilian farmer João da Silva
- Multiple game scenarios (Heat, Flood, Drought, Water Management)
- AI prediction interface for crop survival
- Educational content about climate change impacts
- Multiple farmer characters from different regions

## 🚀 Deployment

This project is configured for GitHub Pages deployment. The game will be automatically deployed when you push to the main branch.

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🛠️ Technology Stack

- **Phaser.js** - Game framework
- **Vite** - Build tool and development server
- **JavaScript ES6+** - Modern JavaScript features
- **CSS3** - Styling and animations

## 📁 Project Structure

```
├── src/
│   ├── main.js          # Main game configuration
│   ├── intro.js         # Introduction scene
│   ├── explore.js       # Scene selection
│   ├── waterScene.js    # Water management tutorial
│   ├── waterGame.js     # Water matching game
│   ├── heatGame.js      # Heat stress game
│   ├── heatmapScene.js  # Heat map visualization
│   ├── drought.js       # Drought scenarios
│   ├── floodGame.js     # Flood management games
│   └── assets/          # Game assets (images, audio, videos)
├── public/
│   └── assets/          # Static assets
└── dist/                # Built files (generated)
```

## 🎯 Game Scenarios

### Water Management

Learn about CO₂ effects on crops and adaptation strategies through interactive tutorials and a matching game.

### Heat Stress

Experience heat wave scenarios and learn about soil cooling techniques.

### Flood Management

Practice flood prevention strategies with interactive drag-and-drop gameplay.

### Drought Conditions

Navigate drought scenarios and learn water conservation techniques.

## 🌍 Educational Content

The game features educational content about:

- Climate change impacts on agriculture
- Adaptation strategies for farmers
- Regional differences in farming challenges
- Sustainable farming practices

## 📝 License

This project is developed for educational purposes as part of NASA's climate education initiatives.

## 🤝 Contributing

Feel free to contribute to this educational project by:

- Reporting bugs
- Suggesting new educational content
- Improving game mechanics
- Adding new scenarios

## 📧 Contact

For questions about this educational game, please open an issue on GitHub.
