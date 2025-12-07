#!/usr/bin/env node

import { Command } from 'commander';
import { MacType } from './mactype';
import { resolve } from 'path';
import { existsSync } from 'fs';

const program = new Command();

program
  .name('mactype')
  .description('TypeScript framework for managing Homebrew packages and macOS settings')
  .version('1.0.0');

program
  .command('apply')
  .description('Apply configuration from a file')
  .argument('[config]', 'Path to configuration file (defaults to ~/.config/macType/config.ts)')
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
        // Try to find default config file
        const configDir = resolve(process.env.HOME || '~', '.config/macType');
        const tsConfig = resolve(configDir, 'config.ts');

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
  .argument('[config]', 'Path to configuration file (defaults to ~/.config/macType/config.ts)')
  .option('-s, --strict', 'Show removals for packages not listed in config')
  .action(async (configPath: string, options) => {
    try {
      const mactype = new MacType();

      let absolutePath: string;

      if (configPath) {
        // User provided a config path
        absolutePath = resolve(configPath);
      } else {
        // Try to find default config file
        const configDir = resolve(process.env.HOME || '~', '.config/macType');
        const tsConfig = resolve(configDir, 'config.ts');

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

program.parse();
