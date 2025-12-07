import { describe, expect, test, mock, beforeEach } from "bun:test";
import { runWorktreeRemove } from "./remove";
import type { RemoveOptions } from "./remove.types";

describe("runWorktreeRemove", () => {
  beforeEach(() => {
    mock.restore();
  });

  test("removes worktree without force flag", async () => {
    const options: RemoveOptions = { f: false, n: true, dryRun: true };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeRemove("../path/to/worktree", options);

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree remove ../path/to/worktree",
    );
  });

  test("removes worktree with force flag", async () => {
    const options: RemoveOptions = { f: true, n: true, dryRun: true };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeRemove("../path/to/worktree", options);

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree remove ../path/to/worktree -f",
    );
  });

  test("handles path with spaces", async () => {
    const options: RemoveOptions = { f: false, n: true, dryRun: true };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeRemove("../path with spaces/worktree", options);

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree remove ../path with spaces/worktree",
    );
  });

  test("handles path with force flag and spaces", async () => {
    const options: RemoveOptions = { f: true, n: true, dryRun: true };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeRemove("../my worktree/path", options);

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree remove ../my worktree/path -f",
    );
  });

  test("removes worktree with relative path", async () => {
    const options: RemoveOptions = { f: false, n: true, dryRun: true };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeRemove("feature/test", options);

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree remove feature/test",
    );
  });

  test("removes worktree with absolute path", async () => {
    const options: RemoveOptions = { f: false, n: true, dryRun: true };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeRemove("/absolute/path/to/worktree", options);

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree remove /absolute/path/to/worktree",
    );
  });

  test("dry run does not execute git command", async () => {
    const options: RemoveOptions = { f: true, n: true, dryRun: true };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeRemove("../feature/test", options);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree remove ../feature/test -f",
    );
  });
});
