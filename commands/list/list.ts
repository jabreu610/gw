import pc from "picocolors";
import startCase from "lodash.startcase";
import type { ListOptions } from "./list.types";
import { BRANCH_PREFIXES } from "./list.constants";
import { getCurrentBranch, getWorktreeList, $ } from "./list.shell";

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
    const currentBranch = await getCurrentBranch(options.dryRun);
    const groups: BranchGroup[] = [];
    for await (let ln of getWorktreeList(options.dryRun)) {
      if (!ln) continue;
      const match = ln.match(
        /^(?<path>.+?)\s+(?<hash>[0-9a-f]+)?\s?(?:\((?<bare>.*)\))?(?:\[(?<branch>.+)\])?$/,
      );
      if (!match || !match.groups) {
        const group = getGroup(groups, "unknown");
        group.lines.push({ raw: ln });
        continue;
      }
      const { path, bare, hash, branch } = match.groups;
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
    groups.sort((a, b) => {
      if (a.name === "bare") return -1;
      if (b.name === "bare") return 1;
      if (a.name === "unknown") return 1;
      if (b.name === "unknown") return -1;
      return a.name.localeCompare(b.name);
    });
    for (const section of groups) {
      const { name, lines } = section;
      console.log(`${pc.bold(startCase(name))} ${lines.length}`);
      for (const line of lines) {
        const { path, bare, hash, branch, raw } = line;
        if (path && bare) {
          console.log(
            `${pc.yellow(`${branch === currentBranch ? " ★ " : "   "}`)}${pc.dim(path)} ${pc.blue(bare)}`,
          );
        } else if (path && hash && branch) {
          console.log(
            `${pc.yellow(`${branch === currentBranch ? " ★ " : "   "}`)}${pc.dim(path)} ${pc.blue(hash)} ${pc.yellow(`${branch}`)}`,
          );
        } else {
          console.log(
            `${pc.yellow(`${branch === currentBranch ? " ★ " : "   "}`)}${raw}`,
          );
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
