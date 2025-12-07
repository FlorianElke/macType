import { runCommand, runCommandSafe } from '../utils/exec';
import { GitState, GitSetting, GitSettingDiff, ApplyResult } from '../types';

export class GitManager {
  async getCurrentState(settings: GitSetting[]): Promise<GitState> {
    const state = new Map<string, string>();

    for (const setting of settings) {
      const key = `${setting.scope}.${setting.key}`;
      try {
        const scope = setting.scope === 'global' ? '--global' : setting.scope === 'system' ? '--system' : '--local';
        const { stdout } = await runCommandSafe(`git config ${scope} ${setting.key}`);
        if (stdout) {
          state.set(key, stdout.trim());
        }
      } catch (error) {
        // Setting doesn't exist
        state.set(key, '');
      }
    }

    return { settings: state };
  }

  async applySettingDiff(diff: GitSettingDiff): Promise<ApplyResult> {
    const { scope, key, desiredValue, action } = diff;
    const scopeFlag = scope === 'global' ? '--global' : scope === 'system' ? '--system' : '--local';

    if (action === 'none') {
      return {
        success: true,
        message: `No change needed for git config ${scope} ${key}`
      };
    }

    if (action === 'remove') {
      try {
        await runCommand(`git config ${scopeFlag} --unset ${key}`);
        return {
          success: true,
          message: `Removed git config: ${scope} ${key}`
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Failed to remove git config: ${scope} ${key}`,
          error: error.message
        };
      }
    }

    try {
      await runCommand(`git config ${scopeFlag} "${key}" "${desiredValue}"`);
      return {
        success: true,
        message: `${action === 'add' ? 'Added' : 'Updated'} git config: ${scope} ${key} = ${desiredValue}`
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to ${action} git config: ${scope} ${key}`,
        error: error.message
      };
    }
  }
}
