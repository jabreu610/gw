import { mock } from "bun:test";

// Create a mock ShellError class
class MockShellError extends Error {
  stdout = Buffer.from("");
  stderr = Buffer.from("git command failed");
  exitCode = 1;
}

// Store the mock state that tests can configure
export const mockState = {
  worktreeOutput: [] as string[],
  currentBranch: "main",
  shouldThrowError: false,
  errorType: "none" as "none" | "getCurrentBranch" | "getWorktreeList",
};

// Mock the shell wrapper module before any other modules import it
mock.module("./list.shell", () => ({
  getCurrentBranch: async (dryRun = false) => {
    if (
      mockState.shouldThrowError &&
      mockState.errorType === "getCurrentBranch"
    ) {
      throw new MockShellError("git command failed");
    }
    if (dryRun) {
      console.log("dryrun: git branch --show-current");
      return "";
    }
    return mockState.currentBranch;
  },
  getWorktreeList: async function* (dryRun = false) {
    if (
      mockState.shouldThrowError &&
      mockState.errorType === "getWorktreeList"
    ) {
      throw new MockShellError("git command failed");
    }
    if (dryRun) {
      console.log("dryrun: git worktree list");
      return;
    }
    for (const line of mockState.worktreeOutput) {
      yield line;
    }
  },
  $: { ShellError: MockShellError },
}));
