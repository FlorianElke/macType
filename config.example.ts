import { Configuration } from './src/types';
import { dockSetting } from './src/managers/macos-defaults';

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
     * macOS Dock settings
     * Use dockSetting() for type-safe Dock configuration with IntelliSense
     * 
     * When you type dockSetting('', you get autocomplete for all available settings!
     * 
     * Example:
     *   dockSetting('autohide', true)           // Auto-hide the Dock
     *   dockSetting('tilesize', 48)             // Icon size
     *   dockSetting('orientation', 'left')       // Dock position
     *   dockSetting('show-recents', false)      // Hide recent apps
     */
    settings: [
      // Dock examples with IntelliSense:
      dockSetting('autohide', true),
      dockSetting('tilesize', 48),

      // More Dock settings (uncomment to use):
      // dockSetting('orientation', 'left'),        // 'left' | 'bottom' | 'right'
      // dockSetting('show-recents', false),
      // dockSetting('mineffect', 'scale'),         // 'genie' | 'scale' | 'suck'
      // dockSetting('autohide-delay', 0),
      // dockSetting('autohide-time-modifier', 0.5),
    ],
  },
};

export default config;
