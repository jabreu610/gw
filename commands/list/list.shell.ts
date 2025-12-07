import { $ } from "bun";

export async function getCurrentBranch(dryRun = false): Promise<string> {
  if (dryRun) {
    const command = await $`echo git branch --show-current`.text();
    console.log(`dryrun: ${command.trim()}`);
    return "";
  }
  return (await $`git branch --show-current`.text()).trim();
}

export async function* getWorktreeList(dryRun = false): AsyncGenerator<string> {
  if (dryRun) {
    const command = await $`echo git worktree list`.text();
    console.log(`dryrun: ${command.trim()}`);
    return;
  }
  for await (const line of $`git worktree list`.lines()) {
    yield line;
  }
}

export { $ };
