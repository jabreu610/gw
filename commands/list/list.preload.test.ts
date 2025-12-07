import { mock } from "bun:test";

// Store the mock state that tests can configure
export const mockState = {
  worktreeOutput: [] as string[],
  currentBranch: "main",
};

// Mock the shell wrapper module before any other modules import it
mock.module("./list.shell", () => ({
  getCurrentBranch: async (dryRun = false) => {
    if (dryRun) {
      console.log("dryrun: git branch --show-current");
      return "";
    }
    return mockState.currentBranch;
  },
  getWorktreeList: async function* (dryRun = false) {
    if (dryRun) {
      console.log("dryrun: git worktree list");
      return;
    }
    for (const line of mockState.worktreeOutput) {
      yield line;
    }
  },
  $: { ShellError: class ShellError extends Error {} },
}));
