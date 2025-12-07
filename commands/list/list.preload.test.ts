import { mock } from "bun:test";

// Store the mock state that tests can configure
export const mockState = {
  worktreeOutput: [] as string[],
  currentBranch: "main",
};

// Mock the shell wrapper module before any other modules import it
mock.module("./shell", () => ({
  getCurrentBranch: async () => mockState.currentBranch,
  getWorktreeList: async function* () {
    for (const line of mockState.worktreeOutput) {
      yield line;
    }
  },
  $: { ShellError: class ShellError extends Error {} },
}));
