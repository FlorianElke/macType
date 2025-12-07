import { runCommand, runCommandSafe } from '../utils/exec';
import { MacOSState, MacOSSetting, MacOSSettingDiff, ApplyResult } from '../types';

// Mapping of domains to processes that need to be restarted
const DOMAIN_TO_PROCESS: Record<string, string> = {
  // Dock & Mission Control
  'com.apple.dock': 'Dock',
  
  // Finder & Desktop
  'com.apple.finder': 'Finder',
  
  // Menu Bar & System UI
  'com.apple.systemuiserver': 'SystemUIServer',
  'com.apple.menuextra.clock': 'SystemUIServer',
  'NSGlobalDomain': 'SystemUIServer',
  
  // Screenshots
  'com.apple.screencapture': 'SystemUIServer',
  
  // Safari
  'com.apple.Safari': 'Safari',
  
  // Activity Monitor
  'com.apple.ActivityMonitor': 'Activity Monitor',
  
  // TextEdit
  'com.apple.TextEdit': 'TextEdit',
  
  // Messages
  'com.apple.MobileSMS': 'Messages',
  
  // Simulator
  'com.apple.iphonesimulator': 'Simulator',
  
  // Xcode
  'com.apple.dt.Xcode': 'Xcode',
  
  // Time Machine
  'com.apple.TimeMachine': 'SystemUIServer',
  
  // Trackpad (requires logout/login, but we track it anyway)
  'com.apple.AppleMultitouchTrackpad': 'SystemUIServer',
};

export class MacOSManager {
  private processesToRestart = new Set<string>();
  async getCurrentState(settings: MacOSSetting[]): Promise<MacOSState> {
    const state = new Map<string, any>();

    for (const setting of settings) {
      const key = `${setting.domain}:${setting.key}`;
      try {
        const { stdout } = await runCommandSafe(`defaults read ${setting.domain} ${setting.key}`);
        if (stdout) {
          state.set(key, this.parseDefaultsOutput(stdout.trim()));
        }
      } catch (error) {
        state.set(key, undefined);
      }
    }

    return { settings: state };
  }

  private parseDefaultsOutput(output: string): any {
    output = output.trim();

    if (output === '1' || output.toLowerCase() === 'true') {
      return true;
    }
    if (output === '0' || output.toLowerCase() === 'false') {
      return false;
    }

    const numValue = Number(output);
    if (!isNaN(numValue) && output === numValue.toString()) {
      return numValue;
    }

    return output;
  }

  private inferType(value: any): string {
    if (typeof value === 'boolean') {
      return 'bool';
    }
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'int' : 'float';
    }
    if (typeof value === 'string') {
      return 'string';
    }
    if (Array.isArray(value)) {
      return 'array';
    }
    if (typeof value === 'object') {
      return 'dict';
    }
    return 'string';
  }

  private formatValue(value: any, type?: string): string {
    const inferredType = type || this.inferType(value);

    switch (inferredType) {
      case 'bool':
        return value ? '1' : '0';
      case 'int':
      case 'float':
        return value.toString();
      case 'string':
        return `"${value}"`;
      case 'array':
        return Array.isArray(value) ? `'(${value.map(v => `"${v}"`).join(', ')})'` : `'(${value})'`;
      case 'dict':
        return `'${JSON.stringify(value)}'`;
      default:
        return `"${value}"`;
    }
  }

  async applySettingDiff(diff: MacOSSettingDiff): Promise<ApplyResult> {
    const { domain, key, desiredValue, action, type } = diff;

    if (action === 'none') {
      return {
        success: true,
        message: `No change needed for ${domain} ${key}`
      };
    }

    if (action === 'remove') {
      try {
        await runCommand(`defaults delete ${domain} ${key}`);
        return {
          success: true,
          message: `Deleted setting: ${domain} ${key}`
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Failed to delete setting: ${domain} ${key}`,
          error: error.message
        };
      }
    }

    const inferredType = type || this.inferType(desiredValue);
    const formattedValue = this.formatValue(desiredValue, inferredType);

    const command = `defaults write ${domain} "${key}" -${inferredType} ${formattedValue}`;

    try {
      await runCommand(command);
      
      // Track which process needs to be restarted
      const processToRestart = DOMAIN_TO_PROCESS[domain];
      if (processToRestart) {
        this.processesToRestart.add(processToRestart);
      }
      
      return {
        success: true,
        message: `${action === 'add' ? 'Added' : 'Updated'} setting: ${domain} ${key} = ${desiredValue}`
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to ${action} setting: ${domain} ${key}`,
        error: error.message
      };
    }
  }

  async restartProcesses(): Promise<void> {
    if (this.processesToRestart.size === 0) {
      return;
    }

    for (const process of this.processesToRestart) {
      try {
        await runCommand(`killall ${process}`);
        console.log(`  ↻ Restarted ${process}`);
      } catch (error) {
        // Process might not be running, that's okay
      }
    }

    // Clear the set for next run
    this.processesToRestart.clear();
  }
}
