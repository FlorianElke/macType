#!/usr/bin/env node

import { Command } from 'commander';
import { MacType } from './mactype';
import { AppStoreManager } from './managers/appstore';
import { resolve } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';

const program = new Command();

program
  .name('mactype')
  .description('TypeScript framework for managing Homebrew packages and macOS settings')
  .version('1.0.0');

program
  .command('apply')
  .description('Apply configuration from a file')
  .argument('[config]', 'Path to configuration file (defaults to ~/.local/macType/config.ts)')
  .option('-d, --dry-run', 'Show what would be changed without applying')
  .option('-v, --verbose', 'Verbose output')
  .option('-s, --strict', 'Remove packages not listed in config (default: false)')
  .action(async (configPath: string, options) => {
    try {
      const mactype = new MacType();

      let absolutePath: string;

      if (configPath) {
        // User provided a config path
        absolutePath = resolve(configPath);
      } else {
        // Try to find default config file in repo directory
        const repoDir = resolve(process.env.HOME || '~', '.local/macType');
        const tsConfig = resolve(repoDir, 'config.ts');

        if (existsSync(tsConfig)) {
          absolutePath = tsConfig;
        } else {
          throw new Error(
            `No configuration file found. Expected:\n  - ${tsConfig}\n\nRun './init.sh' to create a default configuration.`
          );
        }
      }

      await mactype.run(absolutePath, {
        dryRun: options.dryRun,
        verbose: options.verbose,
        strict: options.strict
      });
    } catch (error: any) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('diff')
  .description('Show what changes would be applied without executing them')
  .argument('[config]', 'Path to configuration file (defaults to ~/.local/macType/config.ts)')
  .option('-s, --strict', 'Show removals for packages not listed in config')
  .action(async (configPath: string, options) => {
    try {
      const mactype = new MacType();

      let absolutePath: string;

      if (configPath) {
        // User provided a config path
        absolutePath = resolve(configPath);
      } else {
        // Try to find default config file in repo directory
        const repoDir = resolve(process.env.HOME || '~', '.local/macType');
        const tsConfig = resolve(repoDir, 'config.ts');

        if (existsSync(tsConfig)) {
          absolutePath = tsConfig;
        } else {
          throw new Error(
            `No configuration file found. Expected:\n  - ${tsConfig}\n\nRun './init.sh' to create a default configuration.`
          );
        }
      }

      await mactype.run(absolutePath, {
        dryRun: true,
        verbose: false,
        strict: options.strict
      });
    } catch (error: any) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('search')
  .description('Search for Mac App Store applications')
  .argument('<query>', 'Search query (app name)')
  .action(async (query: string) => {
    try {
      const appstoreManager = new AppStoreManager();

      console.log(chalk.bold.cyan('\n📱 Searching App Store...\n'));

      const results = await appstoreManager.search(query);

      if (results.length === 0) {
        console.log(chalk.yellow('No apps found matching your query.'));
        return;
      }

      console.log(chalk.green(`Found ${results.length} app(s):\n`));

      for (const app of results) {
        console.log(chalk.bold(app.name));
        console.log(chalk.dim(`  ID: ${app.id}`));
        console.log(chalk.dim(`  Version: ${app.version}`));
        console.log(chalk.cyan(`  Config: { id: ${app.id}, name: '${app.name}' }`));
        console.log();
      }

      console.log(chalk.dim('💡 Copy the config line to your appstore.apps array'));
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();
