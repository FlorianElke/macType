import { readlinkSync, existsSync, lstatSync, mkdirSync, writeFileSync, renameSync, unlinkSync, symlinkSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { FileState, ConfigFile, FileDiff, ApplyResult } from '../types';

export class FileManager {
  private generatedDir: string;

  constructor(configDir: string) {
    // Store generated files next to config.ts in a .generated directory
    this.generatedDir = resolve(configDir, '.generated');
  }

  private expandHome(filePath: string): string {
    if (filePath.startsWith('~/')) {
      return resolve(process.env.HOME || '~', filePath.slice(2));
    }
    return filePath;
  }

  async getCurrentState(files: ConfigFile[]): Promise<FileState> {
    const symlinks = new Map<string, string>();

    for (const file of files) {
      const target = this.expandHome(file.target);

      if (existsSync(target)) {
        try {
          const stats = lstatSync(target);
          if (stats.isSymbolicLink()) {
            const linkTarget = readlinkSync(target);
            symlinks.set(target, linkTarget);
          }
        } catch (error) {
          // Ignore errors reading symlinks
        }
      }
    }

    return { symlinks };
  }

  private async generateConfigFile(sourcePath: string, configDir: string): Promise<string> {
    const absoluteSource = resolve(configDir, sourcePath);

    if (!existsSync(absoluteSource)) {
      throw new Error(`Source file not found: ${absoluteSource}`);
    }

    // If it's a TypeScript file, compile it
    if (absoluteSource.endsWith('.ts')) {
      // Register ts-node if not already registered
      try {
        require('ts-node/register');
      } catch (e) {
        // ts-node might already be registered
      }

      // Clear the require cache to ensure fresh load
      delete require.cache[absoluteSource];

      // Load the TypeScript/JavaScript module
      const module = require(absoluteSource);

      // Support both default export and named export
      const content = module.default || module.content || module;

      if (typeof content === 'function') {
        // If it's a function, call it to get the content
        return await content();
      } else if (typeof content === 'string') {
        // If it's a string, use it directly
        return content;
      } else {
        throw new Error(`Config file ${sourcePath} must export a string or function that returns a string`);
      }
    } else {
      // For non-TypeScript files, just read them directly
      const { readFileSync } = require('fs');
      return readFileSync(absoluteSource, 'utf-8');
    }
  }

  async applyFileDiff(diff: FileDiff, configDir: string): Promise<ApplyResult> {
    const { action, source, target, backup } = diff;
    const expandedTarget = this.expandHome(target);

    if (action === 'none') {
      return {
        success: true,
        message: `No change needed for ${target}`
      };
    }

    if (action === 'remove') {
      try {
        if (existsSync(expandedTarget)) {
          unlinkSync(expandedTarget);
        }
        return {
          success: true,
          message: `Removed symlink: ${target}`
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Failed to remove symlink: ${target}`,
          error: error.message
        };
      }
    }

    try {
      // Generate the config file content
      const content = await this.generateConfigFile(source, configDir);

      // Ensure .generated directory exists
      if (!existsSync(this.generatedDir)) {
        mkdirSync(this.generatedDir, { recursive: true });
      }

      // Write generated content to .generated directory
      const generatedFileName = basename(target);
      const generatedPath = resolve(this.generatedDir, generatedFileName);
      writeFileSync(generatedPath, content, 'utf-8');

      // Backup existing file if requested
      if (backup && existsSync(expandedTarget) && !lstatSync(expandedTarget).isSymbolicLink()) {
        const backupPath = `${expandedTarget}.backup`;
        renameSync(expandedTarget, backupPath);
      }

      // Remove existing file/symlink
      if (existsSync(expandedTarget)) {
        unlinkSync(expandedTarget);
      }

      // Ensure target directory exists
      const targetDir = dirname(expandedTarget);
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      // Create symlink
      symlinkSync(generatedPath, expandedTarget);

      return {
        success: true,
        message: `${action === 'add' ? 'Created' : 'Updated'} symlink: ${target} -> ${generatedPath}`
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to ${action} file: ${target}`,
        error: error.message
      };
    }
  }
}
