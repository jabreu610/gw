import { removeWorktree, $ } from "./remove.shell";
import type { RemoveOptions } from "./remove.types";

export async function runWorktreeRemove(path: string, options: RemoveOptions) {
  const args = [path];
  const { f: force, n: dryRun } = options;

  if (force) {
    args.push("-f");
  }
  try {
    await removeWorktree(args, dryRun);
  } catch (error) {
    if (error instanceof $.ShellError) {
      console.error(`Unable to remove worktree: ${error}`);
      process.exit(1);
    }
    throw error;
  }
}
