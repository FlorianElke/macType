

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


export function userSetting(key: keyof UserSettings, value: string) {
  return {
    scope: 'global' as const,
    key: `user.${key}`,
    value,
  };
}


export function coreSetting(key: keyof CoreSettings, value: string | boolean) {
  return {
    scope: 'global' as const,
    key: `core.${key}`,
    value: String(value),
  };
}

 
export function pushSetting(key: keyof PushSettings, value: string | boolean) {
  return {
    scope: 'global' as const,
    key: `push.${key}`,
    value: String(value),
  };
}

export function pullSetting(key: keyof PullSettings, value: string | boolean) {
  return {
    scope: 'global' as const,
    key: `pull.${key}`,
    value: String(value),
  };
}

export function commitSetting(key: keyof CommitSettings, value: string | boolean) {
  return {
    scope: 'global' as const,
    key: `commit.${key}`,
    value: String(value),
  };
}

export function initSetting(key: keyof InitSettings, value: string) {
  return {
    scope: 'global' as const,
    key: `init.${key}`,
    value,
  };
}

export function diffSetting(key: keyof DiffSettings, value: string) {
  return {
    scope: 'global' as const,
    key: `diff.${key}`,
    value,
  };
}

export function mergeSetting(key: keyof MergeSettings, value: string | boolean) {
  return {
    scope: 'global' as const,
    key: `merge.${key}`,
    value: String(value),
  };
}

export function credentialSetting(key: keyof CredentialSettings, value: string) {
  return {
    scope: 'global' as const,
    key: `credential.${key}`,
    value,
  };
}

export function aliasSetting(aliasName: string, command: string) {
  return {
    scope: 'global' as const,
    key: `alias.${aliasName}`,
    value: command,
  };
}

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


export const commonAliases = [
  aliasSetting('co', 'checkout'),
  aliasSetting('br', 'branch'),
  aliasSetting('ci', 'commit'),
  aliasSetting('st', 'status'),
  aliasSetting('unstage', 'reset HEAD --'),
  aliasSetting('last', 'log -1 HEAD'),
  aliasSetting('lg', "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"),
];

export const modernGitSettings = [
  initSetting('defaultBranch', 'main'),
  pullSetting('rebase', true),
  pushSetting('default', 'current'),
  pushSetting('autoSetupRemote', true),
  coreSetting('autocrlf', 'input'),
  credentialSetting('helper', 'osxkeychain'),
];
