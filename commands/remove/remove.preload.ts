import { mock } from "bun:test";

// Create a mock ShellError class
class MockShellError extends Error {
  stdout = Buffer.from("");
  stderr = Buffer.from("git command failed");
  exitCode = 1;
}

// Store mock state for tests to configure
export const mockState = {
  shouldThrowError: false,
  args: [] as string[],
  dryRun: false,
};

// Mock the shell wrapper module before any other modules import it
mock.module("./remove.shell", () => ({
  removeWorktree: async (args: string[], dryRun = false) => {
    mockState.args = args;
    mockState.dryRun = dryRun;

    if (mockState.shouldThrowError) {
      throw new MockShellError("git command failed");
    }

    if (dryRun) {
      console.log(`dryrun: git worktree remove ${args.join(" ")}`);
    }
  },
  $: { ShellError: MockShellError },
}));
