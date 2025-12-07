import { $ } from "bun";

export async function removeWorktree(args: string[]): Promise<void> {
  await $`git worktree remove ${args}`;
}

export { $ };
