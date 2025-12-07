/**
 * Type-safe Git configuration helpers
 * Provides IntelliSense support for common Git settings
 */

// ============================================================================
// COMMON GIT SETTINGS TYPES
// ============================================================================

export interface UserSettings {
  name?: string;
  email?: string;
  signingkey?: string;
}

export interface CoreSettings {
  editor?: string;
  autocrlf?: 'true' | 'false' | 'input';
  filemode?: boolean;
  ignorecase?: boolean;
  excludesfile?: string;
}

export interface PushSettings {
  default?: 'nothing' | 'current' | 'upstream' | 'simple' | 'matching';
  followTags?: boolean;
  autoSetupRemote?: boolean;
}

export interface PullSettings {
  rebase?: boolean | 'true' | 'false' | 'interactive' | 'merges';
  ff?: 'only' | 'true' | 'false';
}

export interface CommitSettings {
  gpgsign?: boolean;
  template?: string;
}

export interface InitSettings {
  defaultBranch?: string;
}

export interface DiffSettings {
  tool?: string;
  algorithm?: 'default' | 'minimal' | 'patience' | 'histogram';
}

export interface MergeSettings {
  tool?: string;
  conflictstyle?: 'merge' | 'diff3' | 'zdiff3';
  ff?: boolean | 'only';
}

export interface CredentialSettings {
  helper?: 'osxkeychain' | 'cache' | 'store' | string;
}

export interface AliasSettings {
  [key: string]: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a global git config setting for user identity
 */
export function userSetting(key: keyof UserSettings, value: string) {
  return {
    scope: 'global' as const,
    key: `user.${key}`,
    value,
  };
}

/**
 * Create a global git config setting for core settings
 */
export function coreSetting(key: keyof CoreSettings, value: string | boolean) {
  return {
    scope: 'global' as const,
    key: `core.${key}`,
    value: String(value),
  };
}

/**
 * Create a global git config setting for push behavior
 */
export function pushSetting(key: keyof PushSettings, value: string | boolean) {
  return {
    scope: 'global' as const,
    key: `push.${key}`,
    value: String(value),
  };
}

/**
 * Create a global git config setting for pull behavior
 */
export function pullSetting(key: keyof PullSettings, value: string | boolean) {
  return {
    scope: 'global' as const,
    key: `pull.${key}`,
    value: String(value),
  };
}

/**
 * Create a global git config setting for commit behavior
 */
export function commitSetting(key: keyof CommitSettings, value: string | boolean) {
  return {
    scope: 'global' as const,
    key: `commit.${key}`,
    value: String(value),
  };
}

/**
 * Create a global git config setting for init settings
 */
export function initSetting(key: keyof InitSettings, value: string) {
  return {
    scope: 'global' as const,
    key: `init.${key}`,
    value,
  };
}

/**
 * Create a global git config setting for diff tool
 */
export function diffSetting(key: keyof DiffSettings, value: string) {
  return {
    scope: 'global' as const,
    key: `diff.${key}`,
    value,
  };
}

/**
 * Create a global git config setting for merge tool
 */
export function mergeSetting(key: keyof MergeSettings, value: string | boolean) {
  return {
    scope: 'global' as const,
    key: `merge.${key}`,
    value: String(value),
  };
}

/**
 * Create a global git config setting for credential helper
 */
export function credentialSetting(key: keyof CredentialSettings, value: string) {
  return {
    scope: 'global' as const,
    key: `credential.${key}`,
    value,
  };
}

/**
 * Create a global git alias
 */
export function aliasSetting(aliasName: string, command: string) {
  return {
    scope: 'global' as const,
    key: `alias.${aliasName}`,
    value: command,
  };
}

/**
 * Create a custom git config setting
 */
export function gitSetting(
  scope: 'global' | 'system' | 'local',
  key: string,
  value: string
) {
  return {
    scope,
    key,
    value,
  };
}

// ============================================================================
// COMMON PRESETS
// ============================================================================

/**
 * Common Git aliases preset
 */
export const commonAliases = [
  aliasSetting('co', 'checkout'),
  aliasSetting('br', 'branch'),
  aliasSetting('ci', 'commit'),
  aliasSetting('st', 'status'),
  aliasSetting('unstage', 'reset HEAD --'),
  aliasSetting('last', 'log -1 HEAD'),
  aliasSetting('lg', "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"),
];

/**
 * Recommended Git settings for modern workflows
 */
export const modernGitSettings = [
  initSetting('defaultBranch', 'main'),
  pullSetting('rebase', true),
  pushSetting('default', 'current'),
  pushSetting('autoSetupRemote', true),
  coreSetting('autocrlf', 'input'),
  credentialSetting('helper', 'osxkeychain'),
];
