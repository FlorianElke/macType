import { runCommand, runCommandSafe, runCommandWithOutput } from '../utils/exec';
import { AppStoreApp, AppStoreState, ApplyResult } from '../types';


export class AppStoreManager {
  private verbose: boolean = false;

  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  async isMasInstalled(): Promise<boolean> {
    try {
      await runCommand('which mas');
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentState(): Promise<AppStoreState> {
    const apps = new Map<number, string>();

    try {
      if (!(await this.isMasInstalled())) {
        console.warn('⚠️  mas CLI is not installed. Install with: brew install mas');
        return { apps };
      }

      const { stdout } = await runCommand('mas list');
      const lines = stdout.split('\n').filter((line: string) => line.trim());

      for (const line of lines) {
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

  async install(app: AppStoreApp): Promise<ApplyResult> {
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

  async uninstall(app: AppStoreApp): Promise<ApplyResult> {
    return {
      success: false,
      message: `Cannot uninstall ${app.name}`,
      error: 'mas CLI does not support uninstalling apps. Please uninstall manually.',
    };
  }

  async search(query: string): Promise<Array<{ id: number; name: string; version: string }>> {
    try {
      if (!(await this.isMasInstalled())) {
        throw new Error('mas CLI is not installed. Install with: brew install mas');
      }

      const { stdout } = await runCommand(`mas search "${query}"`);
      const lines = stdout.split('\n').filter((line: string) => line.trim());
      const results: Array<{ id: number; name: string; version: string }> = [];

      for (const line of lines) {
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

  async apply(apps: AppStoreApp[], strict: boolean = false): Promise<void> {
    const currentState = await this.getCurrentState();
    const desiredApps = new Set(apps.map((app) => app.id));

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
