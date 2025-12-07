import { $ } from "bun";

export async function getCurrentBranch(): Promise<string> {
  return (await $`git branch --show-current`.text()).trim();
}

export async function* getWorktreeList(): AsyncGenerator<string> {
  for await (const line of $`git worktree list`.lines()) {
    yield line;
  }
}

export { $ };
