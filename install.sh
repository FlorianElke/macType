#!/usr/bin/env bash

set -e

echo "📦 Installing macType..."

# Determine script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install Node.js first."
    echo ""
    echo "Run ./init.sh to set up everything automatically, or install Node.js manually:"
    echo "  https://nodejs.org/"
    exit 1
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Link globally
echo "🔗 Linking globally..."
npm link

echo "✅ macType has been installed successfully!"
echo ""
echo "Try running: mactype --help"
echo ""
echo "To set up your configuration, run:"
echo "  ./init.sh"
echo ""
echo "This will create the config directory and set up TypeScript support."

