#!/usr/bin/env python3
"""
Simple script to start the AI server
Run this with: python start_ai_server.py
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required Python packages"""
    print("📦 Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False

def start_ai_server():
    """Start the AI server"""
    print("🤖 Starting AI Server...")
    try:
        subprocess.run([sys.executable, "ai_server.py"])
    except KeyboardInterrupt:
        print("\n🛑 AI Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting AI server: {e}")

if __name__ == "__main__":
    print("🚀 NASA Farming Game - AI Server Setup")
    print("=" * 50)
    
    # Check if requirements.txt exists
    if not os.path.exists("requirements.txt"):
        print("❌ requirements.txt not found!")
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        print("❌ Failed to install requirements. Please install manually:")
        print("pip install -r requirements.txt")
        sys.exit(1)
    
    # Start the server
    start_ai_server()
