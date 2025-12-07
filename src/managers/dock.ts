import { runCommand, runCommandSafe } from '../utils/exec';
import { ApplyResult, DockApp } from '../types';

export class DockManager {
  /**
   * Normalize DockApp to object format
   */
  private normalizeDockApp(app: DockApp): { name: string; position?: number } {
    if (typeof app === 'string') {
      return { name: app };
    }
    return app;
  }

  /**
   * Add an app to the Dock
   */
  async addApp(app: DockApp): Promise<ApplyResult> {
    const normalizedApp = this.normalizeDockApp(app);

    try {
      // Check if dockutil is installed
      const { stdout: dockutilPath } = await runCommandSafe('which dockutil');
      if (!dockutilPath) {
        return {
          success: false,
          message: `dockutil not installed. Install with: brew install dockutil`,
          error: 'dockutil command not found'
        };
      }

      const appPath = normalizedApp.name.endsWith('.app')
        ? normalizedApp.name
        : `/Applications/${normalizedApp.name}.app`;

      let command = `dockutil --add "${appPath}"`;
      if (normalizedApp.position) {
        command += ` --position ${normalizedApp.position}`;
      }

      await runCommand(command);

      return {
        success: true,
        message: `Added ${normalizedApp.name} to Dock`
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to add ${normalizedApp.name} to Dock`,
        error: error.message
      };
    }
  }

  /**
   * Remove an app from the Dock
   */
  async removeApp(appName: string): Promise<ApplyResult> {
    try {
      const { stdout: dockutilPath } = await runCommandSafe('which dockutil');
      if (!dockutilPath) {
        return {
          success: false,
          message: `dockutil not installed. Install with: brew install dockutil`,
          error: 'dockutil command not found'
        };
      }

      await runCommand(`dockutil --remove "${appName}"`);

      return {
        success: true,
        message: `Removed ${appName} from Dock`
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to remove ${appName} from Dock`,
        error: error.message
      };
    }
  }

  /**
   * Get current Dock apps
   */
  async getCurrentApps(): Promise<string[]> {
    try {
      const { stdout } = await runCommandSafe('dockutil --list');
      if (!stdout) return [];

      // Parse output format: "App Name\tfile://path\ttype\tplist\tbundle-id"
      const apps = stdout
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          // Split by tab and get first column (app name)
          const parts = line.split('\t');
          return parts[0] ? parts[0].trim() : '';
        })
        .filter(name => name);

      return apps;
    } catch (error) {
      return [];
    }
  }

  /**
   * Set Dock apps to exact list (removes all others)
   */
  async setApps(apps: DockApp[]): Promise<ApplyResult[]> {
    const results: ApplyResult[] = [];

    try {
      // Check if dockutil is installed
      const { stdout: dockutilPath } = await runCommandSafe('which dockutil');
      if (!dockutilPath) {
        results.push({
          success: false,
          message: `dockutil not installed. Install with: brew install dockutil`,
          error: 'dockutil command not found'
        });
        return results;
      }

      // Get current apps (only persistent apps, not recent apps)
      const { stdout } = await runCommandSafe('dockutil --list');
      const currentApps = stdout
        .split('\n')
        .filter(line => line.includes('persistentApps'))
        .map(line => {
          const parts = line.split('\t');
          return parts[0] ? parts[0].trim() : '';
        })
        .filter(name => name);

      // Determine desired app names
      const desiredAppNames = new Set(
        apps.map(app => {
          const normalizedApp = this.normalizeDockApp(app);
          // Extract app name from path if needed
          if (normalizedApp.name.endsWith('.app')) {
            return normalizedApp.name.split('/').pop()!.replace('.app', '');
          }
          return normalizedApp.name;
        })
      );

      // Remove apps that are not in desired list
      for (const currentApp of currentApps) {
        if (!desiredAppNames.has(currentApp)) {
          try {
            await runCommand(`dockutil --remove "${currentApp}" --no-restart`);
            results.push({
              success: true,
              message: `Removed ${currentApp} from Dock`
            });
          } catch (error: any) {
            results.push({
              success: false,
              message: `Failed to remove ${currentApp} from Dock`,
              error: error.message
            });
          }
        }
      }

      // Add desired apps that are not currently in Dock
      for (const app of apps) {
        const normalizedApp = this.normalizeDockApp(app);
        const appName = normalizedApp.name.endsWith('.app')
          ? normalizedApp.name.split('/').pop()!.replace('.app', '')
          : normalizedApp.name;

        if (!currentApps.includes(appName)) {
          const appPath = normalizedApp.name.endsWith('.app')
            ? normalizedApp.name
            : `/Applications/${normalizedApp.name}.app`;

          try {
            let command = `dockutil --add "${appPath}" --no-restart`;
            if (normalizedApp.position) {
              command += ` --position ${normalizedApp.position}`;
            }
            await runCommand(command);
            results.push({
              success: true,
              message: `Added ${appName} to Dock`
            });
          } catch (error: any) {
            results.push({
              success: false,
              message: `Failed to add ${appName} to Dock`,
              error: error.message
            });
          }
        }
      }

      // Restart Dock once at the end
      if (results.length > 0) {
        await runCommand('killall Dock');
      }

      return results;
    } catch (error: any) {
      results.push({
        success: false,
        message: 'Failed to set Dock apps',
        error: error.message
      });
      return results;
    }
  }
}
