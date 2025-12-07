#!/bin/bash

set -e

echo "================================"
echo "macType Initialization Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}Error: This script is designed for macOS only.${NC}"
    exit 1
fi

echo -e "${BLUE}Checking dependencies...${NC}"
echo ""

# Check and install Xcode Command Line Tools (required for git and Homebrew)
echo -e "${BLUE}Checking Xcode Command Line Tools...${NC}"
if ! xcode-select -p &> /dev/null; then
    echo -e "${YELLOW}Xcode Command Line Tools not found. Installing...${NC}"
    echo -e "${YELLOW}A dialog will appear. Please click 'Install' and wait for completion.${NC}"

    # Trigger the installation
    xcode-select --install

    # Wait for installation to complete
    echo -e "${YELLOW}Waiting for Xcode Command Line Tools installation to complete...${NC}"
    until xcode-select -p &> /dev/null; do
        sleep 5
    done

    echo -e "${GREEN}✓ Xcode Command Line Tools installed successfully${NC}"
else
    echo -e "${GREEN}✓ Xcode Command Line Tools are already installed${NC}"
fi

echo ""

# Check and install Homebrew
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}Homebrew not found. Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi

    echo -e "${GREEN}✓ Homebrew installed successfully${NC}"
else
    echo -e "${GREEN}✓ Homebrew is already installed${NC}"
fi

echo ""

# Install mas CLI for App Store management
if ! command -v mas &> /dev/null; then
    echo -e "${YELLOW}mas CLI not found. Installing mas for App Store management...${NC}"
    brew install mas
    echo -e "${GREEN}✓ mas CLI installed successfully${NC}"
else
    echo -e "${GREEN}✓ mas CLI is already installed${NC}"
fi

echo ""

# Check and install nvm
if [ ! -d "$HOME/.nvm" ]; then
    echo -e "${YELLOW}nvm not found. Installing nvm...${NC}"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    echo -e "${GREEN}✓ nvm installed successfully${NC}"
else
    echo -e "${GREEN}✓ nvm is already installed${NC}"
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

echo ""

# Check and install Node.js 22
echo -e "${BLUE}Checking Node.js version...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing Node.js 22...${NC}"
    nvm install 22
    nvm use 22
    nvm alias default 22
    echo -e "${GREEN}✓ Node.js 22 installed successfully${NC}"
else
    CURRENT_NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$CURRENT_NODE_VERSION" -lt 22 ]; then
        echo -e "${YELLOW}Current Node.js version is $CURRENT_NODE_VERSION. Installing Node.js 22...${NC}"
        nvm install 22
        nvm use 22
        nvm alias default 22
        echo -e "${GREEN}✓ Node.js 22 installed successfully${NC}"
    else
        echo -e "${GREEN}✓ Node.js $(node -v) is already installed${NC}"
    fi
fi

echo ""

# Create config directory
echo -e "${BLUE}Setting up config directory...${NC}"
CONFIG_DIR="$HOME/.config/macType"
if [ ! -d "$CONFIG_DIR" ]; then
    mkdir -p "$CONFIG_DIR"
    echo -e "${GREEN}✓ Created config directory at $CONFIG_DIR${NC}"
else
    echo -e "${GREEN}✓ Config directory already exists${NC}"
fi

# Determine script directory (works whether script is in repo or installed)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Copy example config if it doesn't exist
if [ ! -f "$CONFIG_DIR/config.ts" ]; then
    if [ -f "$SCRIPT_DIR/config.example.ts" ]; then
        cp "$SCRIPT_DIR/config.example.ts" "$CONFIG_DIR/config.ts"
        echo -e "${GREEN}✓ Created TypeScript config file at $CONFIG_DIR/config.ts${NC}"
        echo -e "${YELLOW}  Please edit $CONFIG_DIR/config.ts with your desired configuration${NC}"
    fi
else
    echo -e "${GREEN}✓ Config file already exists${NC}"
fi

# Copy configs directory if it doesn't exist
if [ ! -d "$CONFIG_DIR/configs" ]; then
    if [ -d "$SCRIPT_DIR/configs" ]; then
        cp -r "$SCRIPT_DIR/configs" "$CONFIG_DIR/"
        echo -e "${GREEN}✓ Created configs directory at $CONFIG_DIR/configs${NC}"
        echo -e "${YELLOW}  Add your dotfile configs in $CONFIG_DIR/configs/${NC}"
    fi
else
    echo -e "${GREEN}✓ Configs directory already exists${NC}"
fi

# Create package.json for npm link support
if [ ! -f "$CONFIG_DIR/package.json" ]; then
    cat > "$CONFIG_DIR/package.json" << 'EOF'
{
  "name": "mactype-config",
  "version": "1.0.0",
  "private": true
}
EOF
    echo -e "${GREEN}✓ Created package.json for npm dependencies${NC}"
else
    echo -e "${GREEN}✓ package.json already exists${NC}"
fi

# Create tsconfig.json for TypeScript support
if [ ! -f "$CONFIG_DIR/tsconfig.json" ]; then
    cat > "$CONFIG_DIR/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  }
}
EOF
    echo -e "${GREEN}✓ Created tsconfig.json for TypeScript support${NC}"
else
    echo -e "${GREEN}✓ tsconfig.json already exists${NC}"
fi

echo ""

# Install npm dependencies
echo -e "${BLUE}Installing npm dependencies...${NC}"
cd "$SCRIPT_DIR"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""

# Build the project
echo -e "${BLUE}Building the project...${NC}"
npm run build
echo -e "${GREEN}✓ Project built successfully${NC}"

echo ""

# Link package globally for TypeScript imports
echo -e "${BLUE}Linking mactype globally...${NC}"
npm link
echo -e "${GREEN}✓ mactype package linked globally${NC}"

echo ""

# Link mactype to config directory for TypeScript IntelliSense
echo -e "${BLUE}Linking mactype to config directory...${NC}"
cd "$CONFIG_DIR"
npm link mactype
cd - > /dev/null
echo -e "${GREEN}✓ mactype types are now available in your config${NC}"
echo -e "${GREEN}  You can now import types from 'mactype' with full IntelliSense!${NC}"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Initialization complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "Next steps:"
echo -e "1. Edit your config file: ${BLUE}$CONFIG_DIR/config.ts${NC}"
echo -e "   (TypeScript config provides IntelliSense and type checking!)"
echo -e "2. Run: ${BLUE}npm run dev apply${NC}"
echo -e "   (or specify a config: ${BLUE}npm run dev apply path/to/config.ts${NC})"
echo ""
