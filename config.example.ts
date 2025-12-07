import { Configuration } from './src/types';

/**
 * macType Configuration
 *
 * This file defines your system's desired state for Homebrew packages and macOS settings.
 * The TypeScript format provides IntelliSense and type checking for better configuration experience.
 *
 * Usage:
 *   npm run dev apply ~/.config/macType/config.ts
 *
 * Or copy this file to ~/.config/macType/config.ts and run:
 *   npm run dev apply
 */
const config: Configuration = {
  brew: {
    /**
     * Homebrew packages (formulas) to install
     * Search for packages at: https://formulae.brew.sh/formula/
     */
    packages: [
      'git',
      'node',
      'wget',
      'mas', // Required for App Store app management
      // Add more packages here
    ],

    /**
     * Homebrew casks (GUI applications) to install
     * Search for casks at: https://formulae.brew.sh/cask/
     */
    casks: [
      // 'visual-studio-code',
      // 'google-chrome',
      // 'iterm2',
      // Add more casks here
    ],
  },

  /**
   * Mac App Store applications
   * Requires 'mas' CLI to be installed (brew install mas)
   *
   * To find app IDs:
   *   mas search "App Name"
   * Or search on https://apps.apple.com and check the URL
   */
  appstore: {
    apps: [
      // { id: 497799835, name: 'Xcode' },
      // { id: 1295203466, name: 'Microsoft Remote Desktop' },
      // { id: 1569813296, name: '1Password for Safari' },
      // Add more App Store apps here
    ],
  },

  macos: {
    /**
     * macOS system settings using the `defaults` command
     *
     * To find settings:
     *   defaults read com.apple.dock              # List all dock settings
     *   defaults read com.apple.dock autohide     # Read a specific setting
     *   defaults domains | tr ',' '\n'            # List all domains
     */
    settings: [
      // Dock settings
      {
        domain: 'com.apple.dock',
        key: 'autohide',
        value: true,
        type: 'bool',
      },
      {
        domain: 'com.apple.dock',
        key: 'tilesize',
        value: 48,
        type: 'int',
      },

      // Finder settings
      // {
      //   domain: 'com.apple.finder',
      //   key: 'ShowPathbar',
      //   value: true,
      //   type: 'bool',
      // },
      // {
      //   domain: 'com.apple.finder',
      //   key: 'ShowStatusBar',
      //   value: true,
      //   type: 'bool',
      // },

      // Global settings
      // {
      //   domain: 'NSGlobalDomain',
      //   key: 'AppleShowAllExtensions',
      //   value: true,
      //   type: 'bool',
      // },

      // Screenshot settings
      // {
      //   domain: 'com.apple.screencapture',
      //   key: 'location',
      //   value: '~/Desktop/Screenshots',
      //   type: 'string',
      // },
    ],
  },
};

export default config;
