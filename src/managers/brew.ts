import { runCommand, runCommandSafe, runCommandWithOutput } from '../utils/exec';
import { BrewState, BrewPackageDiff, BrewCaskDiff, ApplyResult } from '../types';

export class BrewManager {
  private verbose: boolean = false;

  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }
  async getCurrentState(): Promise<BrewState> {
    const packages = new Map<string, string>();
    const casks = new Map<string, string>();

    try {
      const { stdout: packagesOutput } = await runCommand('brew list --formula --versions');
      const packageLines = packagesOutput.trim().split('\n').filter(line => line);

      for (const line of packageLines) {
        const parts = line.trim().split(' ');
        const name = parts[0];
        const version = parts.slice(1).join(' ') || 'unknown';
        packages.set(name, version);
      }
    } catch (error) {
      console.warn('Failed to list brew packages:', error);
    }

    try {
      const { stdout: casksOutput } = await runCommand('brew list --cask --versions');
      const caskLines = casksOutput.trim().split('\n').filter(line => line);

      for (const line of caskLines) {
        const parts = line.trim().split(' ');
        const name = parts[0];
        const version = parts.slice(1).join(' ') || 'unknown';
        casks.set(name, version);
      }
    } catch (error) {
      console.warn('Failed to list brew casks:', error);
    }

    return { packages, casks };
  }

  async applyPackageDiff(diff: BrewPackageDiff): Promise<ApplyResult> {
    switch (diff.action) {
      case 'add':
        const installResult = await runCommandWithOutput(`brew install ${diff.name}`, this.verbose);
        if (installResult.success) {
          return {
            success: true,
            message: `Installed package: ${diff.name}`
          };
        } else {
          return {
            success: false,
            message: `Failed to install package: ${diff.name}`,
            error: installResult.stderr
          };
        }

      case 'remove':
        const uninstallResult = await runCommandWithOutput(`brew uninstall ${diff.name}`, this.verbose);
        if (uninstallResult.success) {
          return {
            success: true,
            message: `Uninstalled package: ${diff.name}`
          };
        } else {
          return {
            success: false,
            message: `Failed to uninstall package: ${diff.name}`,
            error: uninstallResult.stderr
          };
        }

      case 'update':
        const upgradeResult = await runCommandWithOutput(`brew upgrade ${diff.name}`, this.verbose);
        if (upgradeResult.success) {
          return {
            success: true,
            message: `Updated package: ${diff.name}`
          };
        } else {
          return {
            success: false,
            message: `Failed to update package: ${diff.name}`,
            error: upgradeResult.stderr
          };
        }

      case 'none':
        return {
          success: true,
          message: `No action needed for package: ${diff.name}`
        };
    }
  }

  async applyCaskDiff(diff: BrewCaskDiff): Promise<ApplyResult> {
    switch (diff.action) {
      case 'add':
        const installResult = await runCommandWithOutput(`brew install --cask ${diff.name}`, this.verbose);
        if (installResult.success) {
          return {
            success: true,
            message: `Installed cask: ${diff.name}`
          };
        } else {
          return {
            success: false,
            message: `Failed to install cask: ${diff.name}`,
            error: installResult.stderr
          };
        }

      case 'remove':
        const uninstallResult = await runCommandWithOutput(`brew uninstall --cask ${diff.name}`, this.verbose);
        if (uninstallResult.success) {
          return {
            success: true,
            message: `Uninstalled cask: ${diff.name}`
          };
        } else {
          return {
            success: false,
            message: `Failed to uninstall cask: ${diff.name}`,
            error: uninstallResult.stderr
          };
        }

      case 'update':
        const upgradeResult = await runCommandWithOutput(`brew upgrade --cask ${diff.name}`, this.verbose);
        if (upgradeResult.success) {
          return {
            success: true,
            message: `Updated cask: ${diff.name}`
          };
        } else {
          return {
            success: false,
            message: `Failed to update cask: ${diff.name}`,
            error: upgradeResult.stderr
          };
        }

      case 'none':
        return {
          success: true,
          message: `No action needed for cask: ${diff.name}`
        };
    }
  }
}
