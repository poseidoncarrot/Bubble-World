#!/bin/bash

# Bubble World Setup Script
# This script helps set up the development environment for Bubble World

set -e

echo "🫧 Setting up Bubble World..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your Supabase credentials"
    echo "   - Get your Supabase URL and anon key from https://supabase.com/dashboard"
    echo "   - Add them to VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
else
    echo "✅ .env file already exists"
fi

# Create Supabase migration directory if it doesn't exist
if [ ! -d "supabase" ]; then
    echo "📁 Creating Supabase directory..."
    mkdir -p supabase/migrations
fi

# Check if TypeScript configuration exists
if [ ! -f "tsconfig.json" ]; then
    echo "⚠️  TypeScript configuration not found. Please ensure tsconfig.json exists."
fi

# Check if Tailwind configuration exists
if [ ! -f "tailwind.config.js" ]; then
    echo "⚠️  Tailwind configuration not found. Please ensure tailwind.config.js exists."
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Update .env with your Supabase credentials:"
echo "   VITE_SUPABASE_URL=your_supabase_url"
echo "   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
echo ""
echo "2. Set up your Supabase database:"
echo "   - Create a new project at https://supabase.com"
echo "   - Run the SQL migration from supabase/migrations/001_initial_schema.sql"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Open your browser to http://localhost:5173"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🫧 Happy worldbuilding!"
