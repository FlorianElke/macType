import { readlinkSync, existsSync, lstatSync, mkdirSync, writeFileSync, renameSync, unlinkSync, symlinkSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { FileState, ConfigFile, FileDiff, ApplyResult } from '../types';

export class FileManager {
  private generatedDir: string;

  constructor(configDir: string) {
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

    if (absoluteSource.endsWith('.ts')) {
      try {
        require('ts-node/register');
      } catch (e) {
      }

      delete require.cache[absoluteSource];

      const module = require(absoluteSource);

      const content = module.default || module.content || module;

      if (typeof content === 'function') {
        return await content();
      } else if (typeof content === 'string') {
        return content;
      } else {
        throw new Error(`Config file ${sourcePath} must export a string or function that returns a string`);
      }
    } else {
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
      const content = await this.generateConfigFile(source, configDir);

      if (!existsSync(this.generatedDir)) {
        mkdirSync(this.generatedDir, { recursive: true });
      }

      const generatedFileName = basename(target);
      const generatedPath = resolve(this.generatedDir, generatedFileName);
      writeFileSync(generatedPath, content, 'utf-8');

      if (backup && existsSync(expandedTarget) && !lstatSync(expandedTarget).isSymbolicLink()) {
        const backupPath = `${expandedTarget}.backup`;
        renameSync(expandedTarget, backupPath);
      }

      if (existsSync(expandedTarget)) {
        unlinkSync(expandedTarget);
      }

      const targetDir = dirname(expandedTarget);
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

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
