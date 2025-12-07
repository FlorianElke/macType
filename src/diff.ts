import {
  Configuration,
  SystemState,
  Diff,
  BrewPackageDiff,
  BrewCaskDiff,
  AppStoreAppDiff,
  MacOSSettingDiff,
  GitSettingDiff,
  FileDiff,
  DiffAction,
  AppStoreApp
} from './types';

export class DiffEngine {
  generateDiff(config: Configuration, currentState: SystemState, strict: boolean = false, generatedDir?: string, previousSettings?: any[]): Diff {
    const brewPackageDiffs = this.diffBrewPackages(
      config.brew?.packages || [],
      currentState.brew.packages,
      strict
    );

    const brewCaskDiffs = this.diffBrewCasks(
      config.brew?.casks || [],
      currentState.brew.casks,
      strict
    );

    const appstoreAppDiffs = this.diffAppStoreApps(
      config.appstore?.apps || [],
      currentState.appstore.apps,
      strict
    );

    const macosSettingDiffs = this.diffMacOSSettings(
      config.macos?.settings || [],
      currentState.macos.settings,
      previousSettings || []
    );

    const gitSettingDiffs = this.diffGitSettings(
      config.git?.settings || [],
      currentState.git.settings
    );

    const fileDiffs = this.diffFiles(
      config.files?.files || [],
      currentState.files.symlinks,
      generatedDir
    );

    return {
      brew: {
        packages: brewPackageDiffs,
        casks: brewCaskDiffs
      },
      appstore: {
        apps: appstoreAppDiffs
      },
      macos: {
        settings: macosSettingDiffs
      },
      git: {
        settings: gitSettingDiffs
      },
      files: {
        files: fileDiffs
      }
    };
  }

  private diffBrewPackages(
    desired: string[],
    current: Map<string, string>,
    strict: boolean = false
  ): BrewPackageDiff[] {
    const diffs: BrewPackageDiff[] = [];
    const desiredSet = new Set(desired);

    for (const pkg of desired) {
      if (!current.has(pkg)) {
        diffs.push({
          action: 'add',
          name: pkg
        });
      } else {
        diffs.push({
          action: 'none',
          name: pkg,
          currentVersion: current.get(pkg)
        });
      }
    }

    if (strict) {
      for (const [pkg, version] of current.entries()) {
        if (!desiredSet.has(pkg)) {
          diffs.push({
            action: 'remove',
            name: pkg,
            currentVersion: version
          });
        }
      }
    }

    return diffs;
  }

  private diffBrewCasks(
    desired: string[],
    current: Map<string, string>,
    strict: boolean = false
  ): BrewCaskDiff[] {
    const diffs: BrewCaskDiff[] = [];
    const desiredSet = new Set(desired);

    for (const cask of desired) {
      if (!current.has(cask)) {
        diffs.push({
          action: 'add',
          name: cask
        });
      } else {
        diffs.push({
          action: 'none',
          name: cask,
          currentVersion: current.get(cask)
        });
      }
    }

    if (strict) {
      for (const [cask, version] of current.entries()) {
        if (!desiredSet.has(cask)) {
          diffs.push({
            action: 'remove',
            name: cask,
            currentVersion: version
          });
        }
      }
    }

    return diffs;
  }

  private diffAppStoreApps(
    desired: AppStoreApp[],
    current: Map<number, string>,
    strict: boolean = false
  ): AppStoreAppDiff[] {
    const diffs: AppStoreAppDiff[] = [];
    const desiredIds = new Set(desired.map(app => app.id));

    for (const app of desired) {
      if (!current.has(app.id)) {
        diffs.push({
          action: 'add',
          id: app.id,
          name: app.name
        });
      } else {
        diffs.push({
          action: 'none',
          id: app.id,
          name: app.name
        });
      }
    }

    if (strict) {
      for (const [id, name] of current.entries()) {
        if (!desiredIds.has(id)) {
          diffs.push({
            action: 'remove',
            id,
            name
          });
        }
      }
    }

    return diffs;
  }

  private diffMacOSSettings(
    desired: any[],
    current: Map<string, any>,
    previousSettings: any[] = []
  ): MacOSSettingDiff[] {
    const diffs: MacOSSettingDiff[] = [];
    const desiredKeys = new Set<string>();

    // Check all desired settings
    for (const setting of desired) {
      const key = `${setting.domain}:${setting.key}`;
      desiredKeys.add(key);
      const currentValue = current.get(key);

      if (currentValue === undefined) {
        diffs.push({
          action: 'add',
          domain: setting.domain,
          key: setting.key,
          desiredValue: setting.value,
          type: setting.type
        });
      } else if (!this.valuesEqual(currentValue, setting.value)) {
        diffs.push({
          action: 'update',
          domain: setting.domain,
          key: setting.key,
          currentValue,
          desiredValue: setting.value,
          type: setting.type
        });
      } else {
        diffs.push({
          action: 'none',
          domain: setting.domain,
          key: setting.key,
          currentValue,
          desiredValue: setting.value,
          type: setting.type
        });
      }
    }

    // Check for removed settings (were in previous config but not in current)
    for (const prevSetting of previousSettings) {
      const key = `${prevSetting.domain}:${prevSetting.key}`;
      if (!desiredKeys.has(key) && current.get(key) !== undefined) {
        diffs.push({
          action: 'remove',
          domain: prevSetting.domain,
          key: prevSetting.key,
          currentValue: current.get(key)
        });
      }
    }

    return diffs;
  }

  private diffGitSettings(
    desired: any[],
    current: Map<string, string>
  ): GitSettingDiff[] {
    const diffs: GitSettingDiff[] = [];

    for (const setting of desired) {
      const key = `${setting.scope}.${setting.key}`;
      const currentValue = current.get(key);

      if (!currentValue || currentValue === '') {
        diffs.push({
          action: 'add',
          scope: setting.scope,
          key: setting.key,
          desiredValue: setting.value
        });
      } else if (currentValue !== setting.value) {
        diffs.push({
          action: 'update',
          scope: setting.scope,
          key: setting.key,
          currentValue,
          desiredValue: setting.value
        });
      } else {
        diffs.push({
          action: 'none',
          scope: setting.scope,
          key: setting.key,
          currentValue,
          desiredValue: setting.value
        });
      }
    }

    return diffs;
  }

  private valuesEqual(a: any, b: any): boolean {
    if (typeof a === 'boolean' && typeof b === 'boolean') {
      return a === b;
    }

    if (typeof a === 'number' && typeof b === 'number') {
      return a === b;
    }

    if (typeof a === 'string' && typeof b === 'string') {
      return a === b;
    }

    if (typeof a === 'number' && typeof b === 'string') {
      return a.toString() === b;
    }

    if (typeof a === 'string' && typeof b === 'number') {
      return a === b.toString();
    }

    return JSON.stringify(a) === JSON.stringify(b);
  }

  private expandHome(filePath: string): string {
    if (filePath.startsWith('~/')) {
      const path = require('path');
      return path.resolve(process.env.HOME || '~', filePath.slice(2));
    }
    return filePath;
  }

  private diffFiles(
    desired: any[],
    current: Map<string, string>,
    generatedDir?: string
  ): FileDiff[] {
    const diffs: FileDiff[] = [];
    const path = require('path');
    const basename = require('path').basename;

    for (const file of desired) {
      const expandedTarget = this.expandHome(file.target);
      const currentSymlinkTarget = current.get(expandedTarget);

      // Expected symlink target in .generated directory
      const generatedFileName = basename(expandedTarget);
      const expectedTarget = generatedDir ? path.resolve(generatedDir, generatedFileName) : null;

      if (currentSymlinkTarget === undefined) {
        // No symlink exists
        diffs.push({
          action: 'add',
          source: file.source,
          target: file.target,
          backup: file.backup
        });
      } else if (expectedTarget && currentSymlinkTarget !== expectedTarget) {
        // Symlink exists but points to wrong location
        diffs.push({
          action: 'update',
          source: file.source,
          target: file.target,
          currentTarget: currentSymlinkTarget,
          backup: file.backup
        });
      } else {
        // Symlink exists and is correct (but we still need to regenerate the file)
        diffs.push({
          action: 'update',
          source: file.source,
          target: file.target,
          currentTarget: currentSymlinkTarget,
          backup: file.backup
        });
      }
    }

    return diffs;
  }

  hasDifferences(diff: Diff): boolean {
    const hasBrewPackageChanges = diff.brew.packages.some(d => d.action !== 'none');
    const hasBrewCaskChanges = diff.brew.casks.some(d => d.action !== 'none');
    const hasAppStoreChanges = diff.appstore.apps.some(d => d.action !== 'none');
    const hasMacOSChanges = diff.macos.settings.some(d => d.action !== 'none');
    const hasGitChanges = diff.git.settings.some(d => d.action !== 'none');
    const hasFileChanges = diff.files.files.some(d => d.action !== 'none');

    return hasBrewPackageChanges || hasBrewCaskChanges || hasAppStoreChanges || hasMacOSChanges || hasGitChanges || hasFileChanges;
  }
}
