import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import chalk from 'chalk';
import { BrewManager } from './managers/brew';
import { AppStoreManager } from './managers/appstore';
import { MacOSManager } from './managers/macos';
import { GitManager } from './managers/git';
import { FileManager } from './managers/files';
import { DockManager } from './managers/dock';
import { WallpaperManager } from './managers/wallpaper';
import { DiffEngine } from './diff';
import { Configuration, Diff, ApplyResult } from './types';

export interface MacTypeOptions {
  dryRun?: boolean;
  verbose?: boolean;
  strict?: boolean;
}

export class MacType {
  private brewManager: BrewManager;
  private appstoreManager: AppStoreManager;
  private macosManager: MacOSManager;
  private gitManager: GitManager;
  private dockManager: DockManager;
  private wallpaperManager: WallpaperManager;
  private fileManager?: FileManager;
  private diffEngine: DiffEngine;

  constructor() {
    this.brewManager = new BrewManager();
    this.appstoreManager = new AppStoreManager();
    this.macosManager = new MacOSManager();
    this.gitManager = new GitManager();
    this.dockManager = new DockManager();
    this.wallpaperManager = new WallpaperManager();
    this.diffEngine = new DiffEngine();
  }

  private getStateFilePath(): string {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '';
    return join(homeDir, '.config', 'macType', '.state.json');
  }

  private loadPreviousState(): any {
    const stateFile = this.getStateFilePath();
    if (existsSync(stateFile)) {
      try {
        const content = readFileSync(stateFile, 'utf-8');
        return JSON.parse(content);
      } catch (e) {
        return { macos: { settings: [] } };
      }
    }
    return { macos: { settings: [] } };
  }

  private saveCurrentState(config: Configuration): void {
    const stateFile = this.getStateFilePath();
    const state = {
      macos: {
        settings: (config.macos?.settings || []).map(s => ({
          domain: s.domain,
          key: s.key
        }))
      }
    };

    const dir = dirname(stateFile);
    if (!existsSync(dir)) {
      require('fs').mkdirSync(dir, { recursive: true });
    }

    writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf-8');
  }

  async loadConfig(configPath: string): Promise<Configuration> {
    try {
      // Load TypeScript configuration file
      const absolutePath = require('path').resolve(configPath);

      // Register ts-node with custom options if not already registered
      try {
        require('ts-node').register({
          transpileOnly: true,
          compilerOptions: {
            module: 'commonjs',
            allowJs: true,
            esModuleInterop: true,
            moduleResolution: 'node',
          },
        });
      } catch (e) {
        // ts-node might already be registered
      }

      // Clear the require cache to ensure fresh load
      delete require.cache[absolutePath];

      // Load the TypeScript module
      const module = require(absolutePath);

      // Support both default export and named export
      const config = module.default || module.config || module;

      if (!config || typeof config !== 'object') {
        throw new Error('TypeScript config file must export a Configuration object');
      }

      return config as Configuration;
    } catch (error: any) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  async run(configPath: string, options: MacTypeOptions = {}): Promise<void> {
    console.log(chalk.bold.cyan('\n╔═══════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║       macType Configuration       ║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════╝\n'));

    const config = await this.loadConfig(configPath);
    console.log(chalk.blue('📋 Config loaded from:'), chalk.dim(configPath));

    // Set verbose mode for managers
    this.brewManager.setVerbose(options.verbose || false);
    this.appstoreManager.setVerbose(options.verbose || false);

    // Initialize FileManager with config directory
    const configDir = dirname(configPath);
    this.fileManager = new FileManager(configDir);

    console.log(chalk.blue('\n🔍 Reading current system state...'));
    const previousState = this.loadPreviousState();
    const brewState = await this.brewManager.getCurrentState();
    const appstoreState = await this.appstoreManager.getCurrentState();
    const macosState = await this.macosManager.getCurrentState(
      config.macos?.settings || [],
      previousState.macos?.settings || []
    );
    const gitState = await this.gitManager.getCurrentState(config.git?.settings || []);
    const fileState = await this.fileManager.getCurrentState(config.files || []);
    const wallpaperState = this.wallpaperManager.getCurrentState();

    const currentState = {
      brew: brewState,
      appstore: appstoreState,
      macos: macosState,
      git: gitState,
      files: fileState,
      wallpaper: wallpaperState || undefined
    };

    console.log(chalk.blue('⚙️  Generating diff...'));
    const diff = this.diffEngine.generateDiff(
      config,
      currentState,
      options.strict === true,
      this.fileManager['generatedDir'],
      previousState.macos?.settings || []
    );

    this.printDiff(diff, config, configPath);

    if (!this.diffEngine.hasDifferences(diff)) {
      console.log(chalk.green('\n✓ No changes needed. System is already in desired state.'));
      return;
    }

    if (options.dryRun) {
      console.log(chalk.yellow('\n⚠️  Dry run mode - no changes will be applied.'));
      return;
    }

    console.log(chalk.blue('\n🚀 Applying changes...\n'));
    await this.applyDiff(diff, config, options, configDir);

    // Save current state for next run
    if (!options.dryRun) {
      this.saveCurrentState(config);
    }

    console.log(chalk.green.bold('\n✓ System configuration complete!'));
  }

  private printDiff(diff: Diff, config: Configuration, configPath: string): void {
    console.log(chalk.bold.yellow('\n╔═══════════════════════════════════╗'));
    console.log(chalk.bold.yellow('║           CHANGES DIFF            ║'));
    console.log(chalk.bold.yellow('╚═══════════════════════════════════╝\n'));

    const packageChanges = diff.brew.packages.filter(d => d.action !== 'none');
    if (packageChanges.length > 0) {
      console.log(chalk.bold.magenta('📦 Homebrew Packages:'));
      for (const pkg of packageChanges) {
        const line = this.formatDiffLine(pkg.action, pkg.name, pkg.currentVersion);
        console.log(`  ${line}`);
      }
      console.log();
    }

    const caskChanges = diff.brew.casks.filter(d => d.action !== 'none');
    if (caskChanges.length > 0) {
      console.log(chalk.bold.magenta('🍺 Homebrew Casks:'));
      for (const cask of caskChanges) {
        const line = this.formatDiffLine(cask.action, cask.name, cask.currentVersion);
        console.log(`  ${line}`);
      }
      console.log();
    }

    const appChanges = diff.appstore.apps.filter(d => d.action !== 'none');
    if (appChanges.length > 0) {
      console.log(chalk.bold.magenta('📱 App Store Applications:'));
      for (const app of appChanges) {
        const line = this.formatDiffLine(app.action, app.name);
        console.log(`  ${line}`);
      }
      console.log();
    }

    const settingChanges = diff.macos.settings.filter(d => d.action !== 'none');
    if (settingChanges.length > 0) {
      console.log(chalk.bold.magenta('⚙️  macOS Settings:'));
      for (const setting of settingChanges) {
        if (setting.action === 'update') {
          const line = `${this.getActionSymbol(setting.action)} ${chalk.cyan(setting.domain)} ${chalk.dim(setting.key)}: ${chalk.red(setting.currentValue)} ${chalk.dim('→')} ${chalk.green(setting.desiredValue)}`;
          console.log(`  ${line}`);
        } else if (setting.action === 'remove') {
          const line = `${this.getActionSymbol(setting.action)} ${chalk.cyan(setting.domain)} ${chalk.dim(setting.key)} ${chalk.dim('(reset to default)')}`;
          console.log(`  ${line}`);
        } else {
          const line = `${this.getActionSymbol(setting.action)} ${chalk.cyan(setting.domain)} ${chalk.dim(setting.key)} ${chalk.dim('=')} ${chalk.green(setting.desiredValue)}`;
          console.log(`  ${line}`);
        }
      }
      console.log();
    }

    // Show Dock apps if configured
    if (config.macos?.dockApps && config.macos.dockApps.length > 0) {
      console.log(chalk.bold.magenta('🎯 Dock Apps:'));
      for (const app of config.macos.dockApps) {
        const name = typeof app === 'string' ? app : app.name;
        const position = typeof app === 'object' && app.position ? chalk.dim(` [position ${app.position}]`) : '';
        console.log(`  ${chalk.green('+')} ${chalk.cyan(name)}${position}`);
      }
      console.log();
    }

    // Show wallpaper if configured
    if (diff.wallpaper) {
      console.log(chalk.bold.magenta('🖼️  Desktop Wallpaper:'));
      if (diff.wallpaper.from) {
        console.log(`  ${this.getActionSymbol('update')} ${chalk.red(diff.wallpaper.from)} ${chalk.dim('→')} ${chalk.green(diff.wallpaper.to)}`);
      } else {
        console.log(`  ${this.getActionSymbol('add')} ${chalk.green(diff.wallpaper.to)}`);
      }
      console.log();
    }

    const gitChanges = diff.git.settings.filter(d => d.action !== 'none');
    if (gitChanges.length > 0) {
      console.log(chalk.bold.magenta('🔧 Git Configuration:'));
      for (const setting of gitChanges) {
        if (setting.action === 'update') {
          const line = `${this.getActionSymbol(setting.action)} ${chalk.cyan(setting.scope)} ${chalk.dim(setting.key)}: ${chalk.red(setting.currentValue)} ${chalk.dim('→')} ${chalk.green(setting.desiredValue)}`;
          console.log(`  ${line}`);
        } else {
          const line = `${this.getActionSymbol(setting.action)} ${chalk.cyan(setting.scope)} ${chalk.dim(setting.key)} ${chalk.dim('=')} ${chalk.green(setting.desiredValue)}`;
          console.log(`  ${line}`);
        }
      }
      console.log();
    }

    const fileChanges = diff.files.files.filter(d => d.action !== 'none');
    if (fileChanges.length > 0) {
      console.log(chalk.bold.magenta('📄 Config Files:'));
      for (const file of fileChanges) {
        const symbol = this.getActionSymbol(file.action);
        if (file.action === 'update' && file.currentTarget) {
          const line = `${symbol} ${chalk.cyan(file.target)} ${chalk.dim('←')} ${chalk.yellow(file.source)}`;
          console.log(`  ${line}`);
        } else {
          const line = `${symbol} ${chalk.green(file.target)} ${chalk.dim('←')} ${chalk.cyan(file.source)}`;
          console.log(`  ${line}`);
        }
      }
      console.log();
    }
  }

  private formatDiffLine(action: string, name: string, version?: string): string {
    const symbol = this.getActionSymbol(action);
    const versionText = version ? chalk.dim(` (${version})`) : '';

    switch (action) {
      case 'add':
        return `${symbol} ${chalk.green(name)}${versionText}`;
      case 'remove':
        return `${symbol} ${chalk.red(name)}${versionText}`;
      case 'update':
        return `${symbol} ${chalk.yellow(name)}${versionText}`;
      default:
        return `${symbol} ${name}${versionText}`;
    }
  }

  private getActionSymbol(action: string): string {
    switch (action) {
      case 'add':
        return chalk.green('✓');
      case 'remove':
        return chalk.red('✗');
      case 'update':
        return chalk.yellow('↻');
      default:
        return ' ';
    }
  }

  private async applyDiff(diff: Diff, config: Configuration, options: MacTypeOptions, configDir: string): Promise<void> {
    const results: ApplyResult[] = [];

    for (const pkgDiff of diff.brew.packages) {
      if (pkgDiff.action !== 'none') {
        const result = await this.brewManager.applyPackageDiff(pkgDiff);
        results.push(result);
        this.printResult(result, options.verbose);
      }
    }

    for (const caskDiff of diff.brew.casks) {
      if (caskDiff.action !== 'none') {
        const result = await this.brewManager.applyCaskDiff(caskDiff);
        results.push(result);
        this.printResult(result, options.verbose);
      }
    }

    for (const appDiff of diff.appstore.apps) {
      if (appDiff.action === 'add') {
        const result = await this.appstoreManager.install({ id: appDiff.id, name: appDiff.name });
        results.push(result);
        this.printResult(result, options.verbose);
      } else if (appDiff.action === 'remove') {
        const result = await this.appstoreManager.uninstall({ id: appDiff.id, name: appDiff.name });
        results.push(result);
        this.printResult(result, options.verbose);
      }
    }

    for (const settingDiff of diff.macos.settings) {
      if (settingDiff.action !== 'none') {
        const result = await this.macosManager.applySettingDiff(settingDiff);
        results.push(result);
        this.printResult(result, options.verbose);
      }
    }

    // Restart affected processes after all macOS settings have been applied
    await this.macosManager.restartProcesses();

    // Apply Dock apps if configured
    if (config.macos?.dockApps && config.macos.dockApps.length > 0) {
      const dockResults = await this.dockManager.setApps(config.macos.dockApps);
      for (const result of dockResults) {
        results.push(result);
        this.printResult(result, options.verbose);
      }
    }

    // Apply wallpaper if changed
    if (diff.wallpaper) {
      try {
        this.wallpaperManager.setWallpaper(diff.wallpaper.to);
        results.push({
          success: true,
          message: `Set wallpaper to ${diff.wallpaper.to}`
        });
        this.printResult({
          success: true,
          message: `Set wallpaper to ${diff.wallpaper.to}`
        }, options.verbose);
      } catch (error: any) {
        results.push({
          success: false,
          message: `Failed to set wallpaper: ${error.message}`
        });
        this.printResult({
          success: false,
          message: `Failed to set wallpaper: ${error.message}`
        }, options.verbose);
      }
    }

    for (const gitDiff of diff.git.settings) {
      if (gitDiff.action !== 'none') {
        const result = await this.gitManager.applySettingDiff(gitDiff);
        results.push(result);
        this.printResult(result, options.verbose);
      }
    }

    if (this.fileManager) {
      for (const fileDiff of diff.files.files) {
        if (fileDiff.action !== 'none') {
          const result = await this.fileManager.applyFileDiff(fileDiff, configDir);
          results.push(result);
          this.printResult(result, options.verbose);
        }
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(chalk.bold.cyan('\n╔═══════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║             SUMMARY               ║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════╝\n'));

    if (successCount > 0) {
      console.log(chalk.green(`✓ Success: ${successCount}`));
    }
    if (failureCount > 0) {
      console.log(chalk.red(`✗ Failed: ${failureCount}`));
    }

    if (failureCount === 0 && successCount > 0) {
      console.log(chalk.bold.green('\n🎉 All changes applied successfully!\n'));
    } else if (failureCount > 0) {
      console.log(chalk.bold.yellow('\n⚠️  Some changes failed. Check the output above for details.\n'));
    }
  }

  private printResult(result: ApplyResult, verbose?: boolean): void {
    if (result.success) {
      console.log(chalk.green(`  ✓ ${result.message}`));
    } else {
      console.log(chalk.red(`  ✗ ${result.message}`));
      if (verbose && result.error) {
        console.log(chalk.dim(`    Error: ${result.error}`));
      }
    }
  }
}
