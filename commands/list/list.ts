import { $ } from "bun";
import pc from "picocolors";
import type { ListOptions } from "./list.types";
import { BRANCH_PREFIXES } from "./list.constants";

const prefixSet = new Set(BRANCH_PREFIXES);

type BranchGroup = { name: string; lines: { [key: string]: string }[] };

function getGroup(groups: BranchGroup[], name: string) {
  const idx = groups.findIndex((g) => g.name == name);
  let group: (typeof groups)[number];
  if (idx >= 0) {
    group = groups[idx]!;
  } else {
    group = { name, lines: [] };
    groups.push(group);
  }
  return group;
}

export async function runWorktreeList(options: ListOptions) {
  try {
    if (options.dryRun) {
      console.log("Running: git worktree list");
      return;
    }
    const groups: BranchGroup[] = [];
    for await (let ln of $`git worktree list`.lines()) {
      const match = ln.match(
        /^(?<path>.+?)\s+(?<hash>[0-9a-f]+)?\s?(?:\((?<bare>.*)\))?(?:\[(?<branch>.+)\])?$/,
      );
      const { path, bare, hash, branch } = match?.groups ?? {};
      if (bare && path) {
        const group = getGroup(groups, "bare");
        group.lines.push({ path, bare });
      }
      if (path && hash && branch) {
        const groupKey = branch.split("/")[0] ?? "";
        const groupName = prefixSet.has(groupKey) ? groupKey : "branches";
        const group = getGroup(groups, groupName);
        group.lines.push({ path, hash, branch });
      }
    }
    for (const section of groups) {
      const { name, lines } = section;
      console.log(pc.bold(name));
      for (const line of lines) {
        const { path, bare, hash, branch } = line;
        if (path && bare) {
          console.log(`${pc.dim(path)} ${pc.blue(bare)}`);
        } else if (path && hash && branch) {
          console.log(`${pc.dim(path)} ${pc.blue(hash)} ${pc.yellow(branch)}`);
        }
      }
      console.log("");
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
