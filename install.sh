#!/bin/bash

# WeCall Installation Script
# This script will set up both backend and frontend

set -e

echo "=========================================="
echo "   WeCall Installation Script"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Python $(python3 --version) found"
echo "✅ Node.js $(node --version) found"
echo ""

# Backend Setup
echo "=========================================="
echo "Setting up Backend..."
echo "=========================================="
cd backend

echo "📦 Creating virtual environment..."
python3 -m venv venv

echo "📦 Activating virtual environment..."
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

echo "📦 Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

echo "📝 Creating .env file..."
cp .env.example .env 2>/dev/null || echo "⚠️  .env.example not found, skipping..."

echo "✅ Backend setup complete!"
echo ""

# Frontend Setup
echo "=========================================="
echo "Setting up Frontend..."
echo "=========================================="
cd ../frontend

echo "📦 Installing Node dependencies..."
npm install --silent

echo "📝 Creating .env file..."
cp .env.example .env 2>/dev/null || echo "⚠️  .env.example not found, skipping..."

echo "✅ Frontend setup complete!"
echo ""

# Summary
echo "=========================================="
echo "   Installation Complete! 🎉"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start Backend (Terminal 1):"
echo "   cd backend"
echo "   source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "   python run.py"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "For more information, see README.md"
echo "=========================================="
