import { describe, expect, test, mock, beforeEach } from "bun:test";
import { mockState } from "./list.preload";
import { runWorktreeList } from "./list";

describe("runWorktreeList error handling", () => {
  beforeEach(() => {
    mockState.shouldThrowError = false;
    mockState.errorType = "none";
    mockState.worktreeOutput = [];
    mockState.currentBranch = "main";
    mock.restore();
  });

  test("handles ShellError from getCurrentBranch and calls process.exit", async () => {
    mockState.shouldThrowError = true;
    mockState.errorType = "getCurrentBranch";

    const consoleErrorSpy = mock(() => {});
    console.error = consoleErrorSpy;

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
      await runWorktreeList({ dryRun: false });
    } catch (error) {
      expect(error).toBeInstanceOf(ProcessExitError);
    } finally {
      process.exit = originalExit;
    }

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain(
      "Unable to list worktrees:",
    );
    expect(exitCalled).toBe(true);
    expect(exitCode).toBe(1);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  test("handles ShellError from getWorktreeList and calls process.exit", async () => {
    mockState.shouldThrowError = true;
    mockState.errorType = "getWorktreeList";

    const consoleErrorSpy = mock(() => {});
    console.error = consoleErrorSpy;

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
      await runWorktreeList({ dryRun: false });
    } catch (error) {
      expect(error).toBeInstanceOf(ProcessExitError);
    } finally {
      process.exit = originalExit;
    }

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain(
      "Unable to list worktrees:",
    );
    expect(exitCalled).toBe(true);
    expect(exitCode).toBe(1);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
