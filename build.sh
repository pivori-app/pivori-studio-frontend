#!/bin/bash

set -e

echo "🚀 Starting PIVORI Studio v2.0 build..."

# Navigate to frontend
cd frontend

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🔨 Building with Vite..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Output directory: ./dist"

# Return to root
cd ..

echo "🎉 PIVORI Studio v2.0 ready for deployment!"

