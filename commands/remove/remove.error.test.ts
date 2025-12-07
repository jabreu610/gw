import { describe, expect, test, mock, beforeEach } from "bun:test";
// Import preload first to ensure mocks are set up before the module loads
import { mockState } from "./remove.preload";
// Now import the module being tested
import { runWorktreeRemove } from "./remove";

describe("runWorktreeRemove error handling", () => {
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
      await runWorktreeRemove("../feature/test", { f: false });
    } catch (error) {
      // We expect a ProcessExitError to be thrown
      expect(error).toBeInstanceOf(ProcessExitError);
    } finally {
      process.exit = originalExit;
    }

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain(
      "Unable to remove worktree:",
    );
    expect(exitCalled).toBe(true);
    expect(exitCode).toBe(1);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  test("handles ShellError with force flag and calls process.exit", async () => {
    mockState.shouldThrowError = true;

    const consoleErrorSpy = mock(() => {});
    console.error = consoleErrorSpy;

    // Track whether process.exit was called
    let exitCalled = false;
    let exitCode: number | undefined;
    const originalExit = process.exit;

    class ProcessExitError extends Error {
      constructor(public code: number) {
        super(`Process exited with code ${code}`);
      }
    }

    const processExitSpy = mock((code: number) => {
      exitCalled = true;
      exitCode = code;
      throw new ProcessExitError(code);
    });
    process.exit = processExitSpy as any;

    try {
      await runWorktreeRemove("../feature/test", { f: true });
    } catch (error) {
      expect(error).toBeInstanceOf(ProcessExitError);
    } finally {
      process.exit = originalExit;
    }

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain(
      "Unable to remove worktree:",
    );
    expect(exitCalled).toBe(true);
    expect(exitCode).toBe(1);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
