#!/usr/bin/env bash

set -e

echo "🗑️  Uninstalling macType..."

# Unlink globally
echo "🔓 Unlinking global binary..."
npm unlink -g mactype 2>/dev/null || true

echo "✅ macType has been uninstalled successfully!"
echo ""
echo "Note: Your configuration files in ~/.config/macType remain untouched."
echo "To remove them manually:"
echo "  rm -rf ~/.config/macType"
