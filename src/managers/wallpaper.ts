import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

export interface WallpaperState {
  path: string;
}

export class WallpaperManager {

  getCurrentState(): WallpaperState | null {
    try {
      const script = `
        tell application "System Events"
          tell every desktop
            get picture
          end tell
        end tell
      `;

      const result = execSync(`osascript -e '${script}'`, {
        encoding: 'utf-8'
      }).trim();

      const wallpapers = result.split(', ');
      const path = wallpapers[0];

      return path ? { path } : null;
    } catch (error: any) {
      console.error('Failed to get current wallpaper:', error.message);
      return null;
    }
  }


  setWallpaper(wallpaperPath: string): void {
    const resolvedPath = resolve(wallpaperPath);

    if (!existsSync(resolvedPath)) {
      throw new Error(`Wallpaper file not found: ${resolvedPath}`);
    }

    try {
      const script = `
        tell application "System Events"
          tell every desktop
            set picture to "${resolvedPath}"
          end tell
        end tell
      `;

      execSync(`osascript -e '${script}'`, {
        encoding: 'utf-8'
      });
    } catch (error: any) {
      throw new Error(`Failed to set wallpaper: ${error.message}`);
    }
  }


  needsUpdate(currentPath: string | null, desiredPath: string): boolean {
    if (!currentPath) return true;

    const resolvedDesired = resolve(desiredPath);
    const resolvedCurrent = resolve(currentPath);

    return resolvedCurrent !== resolvedDesired;
  }
}
