import { Configuration } from './src/types';
// Import type-safe defaults helpers for IntelliSense support
import {
  dockSetting,
  finderSetting,
  desktopSetting,
  screenshotSetting,
  menuBarSetting,
  mouseSetting,
  trackpadSetting,
  keyboardSetting,
  missionControlSetting,
  xcodeSetting,
  safariSetting,
  activityMonitorSetting,
  globalSetting,
} from './src/managers/macos-defaults';

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
     * METHOD 1: Traditional approach (manual domain/key specification)
     * To find settings:
     *   defaults read com.apple.dock              # List all dock settings
     *   defaults read com.apple.dock autohide     # Read a specific setting
     *   defaults domains | tr ',' '\n'            # List all domains
     *
     * METHOD 2: Type-safe helpers (recommended - provides IntelliSense)
     * Use the imported helper functions like dockSetting(), finderSetting(), etc.
     * These provide autocomplete for all documented settings from macos-defaults.com
     */
    settings: [
      // === DOCK SETTINGS ===
      // Traditional approach:
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

      // === FINDER SETTINGS ===
      // {
      //   domain: 'com.apple.finder',
      //   key: 'ShowPathbar',
      //   value: true,
      //   type: 'bool',
      // },
      // {
      //   domain: 'com.apple.finder',
      //   key: 'AppleShowAllExtensions',
      //   value: true,
      //   type: 'bool',
      // },

      // === KEYBOARD SETTINGS (NSGlobalDomain) ===
      // {
      //   domain: 'NSGlobalDomain',
      //   key: 'ApplePressAndHoldEnabled',
      //   value: false,  // Enable key repeat instead of accent menu
      //   type: 'bool',
      // },
      // {
      //   domain: 'NSGlobalDomain',
      //   key: 'AppleKeyboardUIMode',
      //   value: 2,  // Enable full keyboard navigation
      //   type: 'int',
      // },

      // === MOUSE SETTINGS ===
      // {
      //   domain: 'NSGlobalDomain',
      //   key: 'com.apple.mouse.linear',
      //   value: true,  // Disable mouse acceleration
      //   type: 'bool',
      // },
      // {
      //   domain: 'NSGlobalDomain',
      //   key: 'com.apple.mouse.scaling',
      //   value: 2.5,  // Mouse speed
      //   type: 'float',
      // },

      // === TRACKPAD SETTINGS ===
      // {
      //   domain: 'com.apple.AppleMultitouchTrackpad',
      //   key: 'TrackpadThreeFingerDrag',
      //   value: true,
      //   type: 'bool',
      // },

      // === SCREENSHOT SETTINGS ===
      // {
      //   domain: 'com.apple.screencapture',
      //   key: 'disable-shadow',
      //   value: true,  // Remove shadow from window screenshots
      //   type: 'bool',
      // },
      // {
      //   domain: 'com.apple.screencapture',
      //   key: 'type',
      //   value: 'png',  // Screenshot format: png, jpg, pdf, tiff, bmp, gif
      //   type: 'string',
      // },

      // === MENUBAR SETTINGS ===
      // {
      //   domain: 'com.apple.menuextra.clock',
      //   key: 'FlashDateSeparators',
      //   value: false,  // Flash the time separator every second
      //   type: 'bool',
      // },

      // === DESKTOP SETTINGS ===
      // {
      //   domain: 'com.apple.finder',
      //   key: 'ShowHardDrivesOnDesktop',
      //   value: false,
      //   type: 'bool',
      // },

      // === MISSION CONTROL SETTINGS ===
      // {
      //   domain: 'com.apple.dock',
      //   key: 'mru-spaces',
      //   value: false,  // Don't rearrange Spaces automatically
      //   type: 'bool',
      // },

      // === XCODE SETTINGS ===
      // {
      //   domain: 'com.apple.dt.Xcode',
      //   key: 'ShowBuildOperationDuration',
      //   value: true,  // Show build duration in toolbar
      //   type: 'bool',
      // },

      // === MISCELLANEOUS ===
      // {
      //   domain: 'NSGlobalDomain',
      //   key: 'NSQuitAlwaysKeepsWindows',
      //   value: true,  // Restore windows when quitting and reopening apps
```
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
