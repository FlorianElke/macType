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
 * Files configuration
 */
export interface FilesConfiguration {
  /** List of config files to generate and symlink */
  files?: ConfigFile[];
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
  /** macOS system settings configuration */
  macos?: MacOSConfiguration;
  /** Config files to generate and symlink */
  files?: FilesConfiguration;
}

export interface BrewState {
  packages: Map<string, string>;
  casks: Map<string, string>;
}

export interface MacOSState {
  settings: Map<string, any>;
}

export interface SystemState {
  brew: BrewState;
  macos: MacOSState;
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

export interface MacOSSettingDiff {
  action: DiffAction;
  domain: string;
  key: string;
  currentValue?: any;
  desiredValue?: any;
  type?: string;
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
  macos: {
    settings: MacOSSettingDiff[];
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
