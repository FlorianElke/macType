import { exec } from 'child_process';
import { promisify } from 'util';

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
