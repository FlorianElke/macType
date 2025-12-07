import { runCommand, runCommandSafe, runCommandWithOutput } from '../utils/exec';
import { AppStoreApp, AppStoreState, ApplyResult } from '../types';

/**
 * Manager for Mac App Store applications using the `mas` CLI
 */
export class AppStoreManager {
  private verbose: boolean = false;

  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }
  /**
   * Check if mas CLI is installed
   */
  async isMasInstalled(): Promise<boolean> {
    try {
      await runCommand('which mas');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the current state of installed App Store apps
   */
  async getCurrentState(): Promise<AppStoreState> {
    const apps = new Map<number, string>();

    try {
      // Check if mas is installed
      if (!(await this.isMasInstalled())) {
        console.warn('⚠️  mas CLI is not installed. Install with: brew install mas');
        return { apps };
      }

      // Get list of installed apps
      const { stdout } = await runCommand('mas list');
      const lines = stdout.split('\n').filter((line: string) => line.trim());

      for (const line of lines) {
        // Format: "497799835 Xcode (14.2)"
        const match = line.match(/^(\d+)\s+(.+?)\s+\(/);
        if (match) {
          const id = parseInt(match[1], 10);
          const name = match[2].trim();
          apps.set(id, name);
        }
      }
    } catch (error) {
      console.error('Error reading App Store apps:', error);
    }

    return { apps };
  }

  /**
   * Install an App Store app
   */
  async install(app: AppStoreApp): Promise<ApplyResult> {
    // Check if mas is installed
    if (!(await this.isMasInstalled())) {
      return {
        success: false,
        message: `mas CLI is not installed`,
        error: 'Please install mas with: brew install mas',
      };
    }

    const installResult = await runCommandWithOutput(`mas install ${app.id}`, this.verbose);
    if (installResult.success) {
      return {
        success: true,
        message: `Installed ${app.name}`,
      };
    } else {
      return {
        success: false,
        message: `Failed to install ${app.name}`,
        error: installResult.stderr,
      };
    }
  }

  /**
   * Uninstall an App Store app
   * Note: mas doesn't support uninstalling, so this is a no-op
   */
  async uninstall(app: AppStoreApp): Promise<ApplyResult> {
    return {
      success: false,
      message: `Cannot uninstall ${app.name}`,
      error: 'mas CLI does not support uninstalling apps. Please uninstall manually.',
    };
  }

  /**
   * Search for App Store apps
   */
  async search(query: string): Promise<Array<{ id: number; name: string; version: string }>> {
    try {
      // Check if mas is installed
      if (!(await this.isMasInstalled())) {
        throw new Error('mas CLI is not installed. Install with: brew install mas');
      }

      const { stdout } = await runCommand(`mas search "${query}"`);
      const lines = stdout.split('\n').filter((line: string) => line.trim());
      const results: Array<{ id: number; name: string; version: string }> = [];

      for (const line of lines) {
        // Format: "497799835  Xcode                                (14.2)"
        const match = line.match(/^(\d+)\s+(.+?)\s+\((.+?)\)/);
        if (match) {
          const id = parseInt(match[1], 10);
          const name = match[2].trim();
          const version = match[3].trim();
          results.push({ id, name, version });
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to search App Store: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Apply the desired App Store configuration
   */
  async apply(apps: AppStoreApp[], strict: boolean = false): Promise<void> {
    const currentState = await this.getCurrentState();
    const desiredApps = new Set(apps.map((app) => app.id));

    // Install missing apps
    for (const app of apps) {
      if (!currentState.apps.has(app.id)) {
        console.log(`📱 Installing ${app.name}...`);
        const result = await this.install(app);
        if (result.success) {
          console.log(`   ✅ ${result.message}`);
        } else {
          console.error(`   ❌ ${result.message}`);
          if (result.error) {
            console.error(`      ${result.error}`);
          }
        }
      }
    }

    // In strict mode, warn about extra apps (but can't uninstall)
    if (strict) {
      for (const [id, name] of currentState.apps) {
        if (!desiredApps.has(id)) {
          console.warn(`⚠️  ${name} (${id}) is installed but not in config`);
          console.warn(`   Note: mas CLI does not support uninstalling. Remove manually if desired.`);
        }
      }
    }
  }
}
