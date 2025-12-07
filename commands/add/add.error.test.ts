import { describe, expect, test, mock, beforeEach } from "bun:test";
import { mockState } from "./add.preload.test";
import { runWorktreeAdd } from "./add";

describe("runWorktreeAdd error handling", () => {
  beforeEach(() => {
    mockState.shouldThrowError = false;
    mockState.args = [];
    mockState.dryRun = false;
    mock.restore();
  });

  test("handles ShellError and calls process.exit", async () => {
    mockState.shouldThrowError = true;

    const consoleErrorSpy = mock(() => {});
    console.error = consoleErrorSpy;

    // Track whether process.exit was called
    let exitCalled = false;
    let exitCode: number | undefined;
    const originalExit = process.exit;

    // Create a custom error to throw when process.exit is called
    // This simulates the process exiting
    class ProcessExitError extends Error {
      constructor(public code: number) {
        super(`Process exited with code ${code}`);
      }
    }

    const processExitSpy = mock((code: number) => {
      exitCalled = true;
      exitCode = code;
      // Throw to stop execution, simulating process.exit behavior
      throw new ProcessExitError(code);
    });
    process.exit = processExitSpy as any;

    // The function should handle the error gracefully
    try {
      await runWorktreeAdd("../feature/test", { b: "test-branch" });
    } catch (error) {
      // We expect a ProcessExitError to be thrown
      expect(error).toBeInstanceOf(ProcessExitError);
    } finally {
      process.exit = originalExit;
    }

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain(
      "Unable to add worktree:",
    );
    expect(exitCalled).toBe(true);
    expect(exitCode).toBe(1);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
