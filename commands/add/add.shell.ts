import { $ } from "bun";

export async function addWorktree(args: string[]): Promise<void> {
  await $`git worktree add ${args}`;
}

export { $ };
