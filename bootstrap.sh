#!/usr/bin/env bash

set -e

echo "================================"
echo "macType Bootstrap Installer"
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

# Set installation directory
INSTALL_DIR="$HOME/.local/macType"
REPO_URL="https://github.com/FlorianElke/macType.git"

echo -e "${BLUE}Installing macType to: ${INSTALL_DIR}${NC}"
echo ""

# Create .local directory if it doesn't exist
mkdir -p "$HOME/.local"

# Clone or update repository
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}macType directory already exists. Updating...${NC}"
    cd "$INSTALL_DIR"
    git pull origin main
else
    echo -e "${BLUE}Cloning macType repository...${NC}"
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

echo ""
echo -e "${GREEN}✓ Repository cloned/updated successfully${NC}"
echo ""

# Make scripts executable
chmod +x init.sh install.sh uninstall.sh

# Run init.sh to set up everything
echo -e "${BLUE}Running initialization script...${NC}"
echo ""
./init.sh

echo ""
echo "================================"
echo -e "${GREEN}✅ macType installation complete!${NC}"
echo "================================"
echo ""
echo "Next steps:"
echo "  1. Edit your configuration: ~/.config/macType/config.ts"
echo "  2. Preview changes: mactype diff"
echo "  3. Apply configuration: mactype apply"
echo ""
