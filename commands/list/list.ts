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
      const parts = ln.split(" ").filter((s) => s.length > 0);
      if (parts.length > 0 && parts.length < 3) {
        console.log(`${pc.dim(parts[0])} ${pc.yellow(parts[1])}`);
      } else if (parts.length > 0) {
        console.log(
          `${pc.dim(parts[0])} ${pc.blue(parts[1])} ${pc.yellow(parts[2])}`,
        );
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
