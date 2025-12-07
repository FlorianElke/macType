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

    /**
     * Desktop Wallpaper
     * Provide absolute or relative path to image file
     * Supports: .jpg, .jpeg, .png, .heic, etc.
     * 
     * Examples:
     *   wallpaper: '/System/Library/Desktop Pictures/Sonoma.heic'
     *   wallpaper: './wallpapers/my-wallpaper.jpg'
     *   wallpaper: '~/Pictures/wallpaper.png'
     */
    // wallpaper: '/System/Library/Desktop Pictures/Sonoma.heic',

    /**
     * Dock Apps - Specify which apps should appear in the Dock
     * Requires dockutil: brew install dockutil
     * 
     * Apps will be set to exactly this list (removes apps not in the list)
     * Can be simple strings or objects with position
     */
    dockApps: [
      // Simple strings:
      // 'Safari',
      // 'Mail',
      // 'Calendar',
      // 'Messages',

      // With position (1-based index):
      // { name: 'Visual Studio Code', position: 1 },

      // Full path also works:
      // '/Applications/Google Chrome.app',
    ],
  },

  /**
   * Git Configuration
   * Configure global git settings
   * 
   * Type-safe helpers are available:
   * - userSetting() - User settings (name, email, etc.)
   * - coreSetting() - Core settings (editor, autocrlf, etc.)
   * - commitSetting() - Commit settings (gpgSign, template, etc.)
   * - pushSetting() - Push settings (default, autoSetupRemote, etc.)
   * - pullSetting() - Pull settings (rebase, ff, etc.)
   * - initSetting() - Init settings (defaultBranch, etc.)
   * - aliasSetting() - Git aliases
   * 
   * Or use raw format:
   * { scope: 'global', key: 'user.name', value: 'Your Name' }
   */
  git: {
    settings: [
      // User configuration
      // { scope: 'global', key: 'user.name', value: 'Your Name' },
      // { scope: 'global', key: 'user.email', value: 'your.email@example.com' },

      // Core settings
      // { scope: 'global', key: 'core.editor', value: 'code --wait' },
      // { scope: 'global', key: 'core.autocrlf', value: 'input' },

      // Aliases
      // { scope: 'global', key: 'alias.co', value: 'checkout' },
      // { scope: 'global', key: 'alias.br', value: 'branch' },
      // { scope: 'global', key: 'alias.ci', value: 'commit' },
      // { scope: 'global', key: 'alias.st', value: 'status' },

      // Modern Git settings
      // { scope: 'global', key: 'init.defaultBranch', value: 'main' },
      // { scope: 'global', key: 'pull.rebase', value: 'true' },
      // { scope: 'global', key: 'push.autoSetupRemote', value: 'true' },
    ],
  },

  /**
   * Config files to manage
   *
   * Files can be:
   * - Plain text files (just copied and symlinked)
   * - TypeScript files (.ts) that export content (compiled then symlinked)
   *
   * Examples:
   *   Plain file: { source: './configs/zshrc', target: '~/.zshrc' }
   *   TS file:    { source: './configs/custom.ts', target: '~/.custom' }
   */
  files: [
    // Example: Symlink zshrc from configs folder
    // { source: './configs/zshrc', target: '~/.zshrc', backup: true },

    // Example: TypeScript template (exports string)
    // { source: './configs/gitconfig.ts', target: '~/.gitconfig' },
  ],
};
