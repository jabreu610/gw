import { $ } from "bun";

export async function removeWorktree(
  args: string[],
  dryRun = false,
): Promise<void> {
  if (dryRun) {
    const command = await $`echo git worktree remove ${args}`.text();
    console.log(`dryrun: ${command.trim()}`);
  } else {
    await $`git worktree remove ${args}`;
  }
}

export { $ };
