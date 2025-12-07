/**
 * Homebrew package (formula)
 */
export interface BrewPackage {
  name: string;
  version?: string;
}

/**
 * Homebrew cask (GUI application)
 */
export interface BrewCask {
  name: string;
  version?: string;
}

/**
 * Mac App Store application
 *
 * To find the app ID, search on https://apps.apple.com or use:
 * mas search "App Name"
 *
 * @example
 * {
 *   id: 497799835,
 *   name: "Xcode"
 * }
 */
export interface AppStoreApp {
  /** The App Store ID (numeric) */
  id: number;
  /** The app name (for display purposes) */
  name: string;
}

/**
 * Type of value for macOS defaults system
 */
export type MacOSValueType = 'string' | 'int' | 'float' | 'bool' | 'array' | 'dict';

/**
 * macOS system setting (uses the `defaults` command)
 * @example
 * {
 *   domain: "com.apple.dock",
 *   key: "autohide",
 *   value: true,
 *   type: "bool"
 * }
 */
export interface MacOSSetting {
  /** The preference domain (e.g., "com.apple.dock", "NSGlobalDomain") */
  domain: string;
  /** The preference key */
  key: string;
  /** The value to set */
  value: string | number | boolean | string[] | Record<string, any>;
  /** The type of value (optional, will be inferred if not provided) */
  type?: MacOSValueType;
}

/**
 * Homebrew configuration
 */
export interface BrewConfiguration {
  /** List of Homebrew formulas to install */
  packages?: string[];
  /** List of Homebrew casks to install */
  casks?: string[];
}

/**
 * Mac App Store configuration
 *
 * Requires `mas` (Mac App Store CLI) to be installed.
 * Install with: brew install mas
 *
 * @example
 * {
 *   apps: [
 *     { id: 497799835, name: "Xcode" },
 *     { id: 1295203466, name: "Microsoft Remote Desktop" }
 *   ]
 * }
 */
export interface AppStoreConfiguration {
  /** List of Mac App Store applications to install */
  apps?: AppStoreApp[];
}

/**
 * macOS system settings configuration
 */
export interface MacOSConfiguration {
  /** List of macOS defaults settings to apply */
  settings?: MacOSSetting[];
}

/**
 * Config file to be generated and symlinked
 *
 * @example
 * {
 *   source: './configs/zshrc.ts',
 *   target: '~/.zshrc'
 * }
 */
export interface ConfigFile {
  /** Path to the source TypeScript/JavaScript file that generates the config */
  source: string;
  /** Target path where the symlink should be created (supports ~ expansion) */
  target: string;
  /** Optional: Make backup of existing file before symlinking */
  backup?: boolean;
}

/**
 * Git configuration setting
 * @example
 * {
 *   scope: 'global',
 *   key: 'user.name',
 *   value: 'John Doe'
 * }
 */
export interface GitSetting {
  /** Configuration scope: 'global', 'system', or 'local' */
  scope: 'global' | 'system' | 'local';
  /** The git config key (e.g., 'user.name', 'core.editor') */
  key: string;
  /** The value to set */
  value: string;
}

/**
 * Files configuration
 */
export interface FilesConfiguration {
  /** List of config files to generate and symlink */
  files?: ConfigFile[];
}

/**
 * Git configuration
 */
export interface GitConfiguration {
  /** List of git config settings to apply */
  settings?: GitSetting[];
}

/**
 * Main configuration object for macType
 *
 * @example
 * ```typescript
 * import { Configuration } from './types';
 *
 * const config: Configuration = {
 *   brew: {
 *     packages: ['git', 'node'],
 *     casks: ['visual-studio-code']
 *   },
 *   appstore: {
 *     apps: [
 *       { id: 497799835, name: 'Xcode' },
 *       { id: 1295203466, name: 'Microsoft Remote Desktop' }
 *     ]
 *   },
 *   macos: {
 *     settings: [
 *       {
 *         domain: 'com.apple.dock',
 *         key: 'autohide',
 *         value: true,
 *         type: 'bool'
 *       }
 *     ]
 *   },
 *   git: {
 *     settings: [
 *       {
 *         scope: 'global',
 *         key: 'user.name',
 *         value: 'John Doe'
 *       }
 *     ]
 *   },
 *   files: {
 *     files: [
 *       {
 *         source: './configs/zshrc.ts',
 *         target: '~/.zshrc'
 *       }
 *     ]
 *   }
 * };
 * ```
 */
export interface Configuration {
  /** Homebrew packages and casks configuration */
  brew?: BrewConfiguration;
  /** Mac App Store applications configuration */
  appstore?: AppStoreConfiguration;
  /** macOS system settings configuration */
  macos?: MacOSConfiguration;
  /** Git configuration settings */
  git?: GitConfiguration;
  /** Config files to generate and symlink */
  files?: FilesConfiguration;
}

export interface BrewState {
  packages: Map<string, string>;
  casks: Map<string, string>;
}

export interface AppStoreState {
  apps: Map<number, string>; // id -> name
}

export interface MacOSState {
  settings: Map<string, any>;
}

export interface GitState {
  settings: Map<string, string>;
}

export interface SystemState {
  brew: BrewState;
  appstore: AppStoreState;
  macos: MacOSState;
  git: GitState;
  files: FileState;
}

export type DiffAction = 'add' | 'remove' | 'update' | 'none';

export interface BrewPackageDiff {
  action: DiffAction;
  name: string;
  currentVersion?: string;
  desiredVersion?: string;
}

export interface BrewCaskDiff {
  action: DiffAction;
  name: string;
  currentVersion?: string;
  desiredVersion?: string;
}

export interface AppStoreAppDiff {
  action: DiffAction;
  id: number;
  name: string;
}

export interface MacOSSettingDiff {
  action: DiffAction;
  domain: string;
  key: string;
  currentValue?: any;
  desiredValue?: any;
  type?: string;
}

export interface GitSettingDiff {
  action: DiffAction;
  scope: 'global' | 'system' | 'local';
  key: string;
  currentValue?: string;
  desiredValue?: string;
}

export interface FileDiff {
  action: DiffAction;
  source: string;
  target: string;
  currentTarget?: string;
  backup?: boolean;
}

export interface FileState {
  symlinks: Map<string, string>; // target -> source
}

export interface Diff {
  brew: {
    packages: BrewPackageDiff[];
    casks: BrewCaskDiff[];
  };
  appstore: {
    apps: AppStoreAppDiff[];
  };
  macos: {
    settings: MacOSSettingDiff[];
  };
  git: {
    settings: GitSettingDiff[];
  };
  files: {
    files: FileDiff[];
  };
}

export interface ApplyResult {
  success: boolean;
  message: string;
  error?: string;
}
