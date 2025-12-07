import { $ } from "bun";
import pc from "picocolors";
import type { ListOptions } from "./list.types";

export async function runWorktreeList(options: ListOptions) {
  try {
    if (options.dryRun) {
      console.log("Running: git worktree list");
      return;
    }
    for await (let ln of $`git worktree list`.lines()) {
      const match = ln.match(
        /^(?<path>.+?)\s+(?<hash>[0-9a-f]+)?\s?(?:\((?<bare>.*)\))?(?:\[(?<branch>.+)\])?$/,
      );
      const { path, bare, hash, branch } = match?.groups ?? {};
      if (path && bare) {
        console.log(`${pc.dim(path)} ${pc.yellow(bare)}`);
      } else if (path && hash && branch) {
        console.log(`${pc.dim(path)} ${pc.blue(hash)} ${pc.yellow(branch)}`);
      }
    }
  } catch (error) {
    if (error instanceof $.ShellError) {
      console.error(`Unable to list worktrees: ${error}`);
      process.exit(1);
    }
    throw error;
  }
  return;
}
