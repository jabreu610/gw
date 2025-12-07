import { $ } from "bun";

export async function addWorktree(
  args: string[],
  dryRun = false,
): Promise<void> {
  if (dryRun) {
    const command = await $`echo git worktree add ${args}`.text();
    console.log(`dryrun: ${command.trim()}`);
  } else {
    await $`git worktree add ${args}`;
  }
}

export { $ };
