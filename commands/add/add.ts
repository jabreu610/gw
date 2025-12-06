import upath from "upath";

import { BRANCH_PREFIXES } from "./add.constants";
import type { AddOptions } from "./add.types";
import { $ } from "bun";

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
    if (dryRun) {
      console.log(`Running: git worktree add ${args.join(" ")}`);
    } else {
      await $`git worktree add ${args}`;
    }
  } catch (error) {
    if (error instanceof $.ShellError) {
      console.error(`Unable to add worktree: ${error}`);
    }
    throw error;
    process.exit(1);
  }
}
