import upath from "upath";

import { BRANCH_PREFIXES } from "./add.constants";
import type { AddOptions } from "./add.types";
import { addWorktree, $ } from "./add.shell";

const prefixSet = new Set(BRANCH_PREFIXES);

export async function runWorktreeAdd(path: string, options: AddOptions) {
  const args = [path];

  const { b: branch, B: overrideBranch, n: dryRun } = options;

  if (overrideBranch) {
    args.push("-B", overrideBranch);
  } else if (branch) {
    args.push("-b", branch);
  } else {
    const normalizedPath = upath.normalize(path);
    const pathSegments = normalizedPath.split("/");
    const prefixIndex = pathSegments.findIndex((p) => prefixSet.has(p));
    if (prefixIndex >= 0) {
      const derivedBranch = pathSegments.slice(prefixIndex).join("/");
      args.push("-b", derivedBranch);
    }
  }
  try {
    await addWorktree(args, dryRun);
  } catch (error) {
    if (error instanceof $.ShellError) {
      console.error(`Unable to add worktree: ${error}`);
      process.exit(1);
    }
    throw error;
  }
}
