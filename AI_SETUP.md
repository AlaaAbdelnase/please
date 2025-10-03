# 🤖 AI Prediction Setup

## Quick Start

### Option 1: Automatic Setup (Recommended)

```bash
python start_ai_server.py
```

### Option 2: Manual Setup

1. **Install Python dependencies:**

```bash
pip install -r requirements.txt
```

2. **Start the AI server:**

```bash
python ai_server.py
```

3. **Start your frontend development server:**

```bash
npm run dev
# or
yarn dev
```

## How It Works

1. **AI Server** (`ai_server.py`) runs on `http://localhost:5000`
2. **Frontend** makes POST requests to `/api/predict`
3. **AI Model** processes the request and returns predictions
4. **Results** are displayed in the waterScene

## API Endpoints

- `POST /api/predict` - Get crop yield predictions
- `GET /api/health` - Check if AI server is running

## Example Request

```json
{
  "country": "USA",
  "timeSlice": "2020",
  "co2Effects": "pumping",
  "adaptation": "Level 1"
}
```

## Example Response

```json
{
  "predictions": {
    "wheat": 5.2,
    "rice": -2.1,
    "coarse grains": 8.7,
    "protein feed": 3.4
  },
  "accuracy": "94.2",
  "status": "success"
}
```

## Troubleshooting

- **"AI Service Temporarily Unavailable"**: Make sure the AI server is running
- **Port conflicts**: The AI server uses port 5000, make sure it's available
- **Missing dependencies**: Run `pip install -r requirements.txt`

## Files Created

- `ai_server.py` - Flask server with AI model
- `requirements.txt` - Python dependencies
- `start_ai_server.py` - Automatic setup script
- `AI_SETUP.md` - This documentation
