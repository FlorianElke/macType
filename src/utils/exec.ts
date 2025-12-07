import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

export async function runCommand(command: string): Promise<{ stdout: string; stderr: string }> {
  try {
    const result = await execAsync(command);
    return result;
  } catch (error: any) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

export async function runCommandSafe(command: string): Promise<{ stdout: string; stderr: string; success: boolean }> {
  try {
    const result = await execAsync(command);
    return { ...result, success: true };
  } catch (error: any) {
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || error.message || '',
      success: false
    };
  }
}

/**
 * Run command with live output (only shows important lines)
 */
export async function runCommandWithOutput(command: string, verbose: boolean = false): Promise<{ success: boolean; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    // Filter for important lines
    const isImportantLine = (line: string): boolean => {
      if (verbose) return true; // Show everything in verbose mode

      const importantKeywords = [
        'Installing',
        'Downloading',
        'Downloaded',
        'Installed',
        'Error',
        'Warning',
        'Failed',
        'Success',
        'Updating',
        'Pouring',
        'Summary',
        '✓',
        '✗',
        '==>'
      ];

      return importantKeywords.some(keyword =>
        line.toLowerCase().includes(keyword.toLowerCase())
      );
    };

    child.stdout?.on('data', (data) => {
      const output = data.toString();
      stdout += output;

      const lines = output.split('\n');
      for (const line of lines) {
        if (line.trim() && isImportantLine(line)) {
          // Format the line nicely
          if (line.includes('==>')) {
            console.log(chalk.cyan('   ' + line.trim()));
          } else if (line.toLowerCase().includes('error')) {
            console.log(chalk.red('   ' + line.trim()));
          } else if (line.toLowerCase().includes('warning')) {
            console.log(chalk.yellow('   ' + line.trim()));
          } else {
            console.log(chalk.dim('   ' + line.trim()));
          }
        }
      }
    });

    child.stderr?.on('data', (data) => {
      const output = data.toString();
      stderr += output;

      // Always show stderr if it's not just progress info
      if (verbose || !output.includes('==>')) {
        console.log(chalk.dim('   ' + output.trim()));
      }
    });

    child.on('close', (code) => {
      resolve({
        success: code === 0,
        stdout,
        stderr
      });
    });

    child.on('error', (error) => {
      resolve({
        success: false,
        stdout,
        stderr: error.message
      });
    });
  });
}
