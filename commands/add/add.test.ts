import { describe, expect, test, mock, beforeEach } from "bun:test";
import { runWorktreeAdd } from "./add";
import type { AddOptions } from "./add.types";

describe("runWorktreeAdd", () => {
  beforeEach(() => {
    mock.restore();
  });

  test("adds worktree with explicit branch using -b option", async () => {
    const options: AddOptions = { b: "my-feature" };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeAdd("../path/to/worktree", { ...options, n: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree add ../path/to/worktree -b my-feature",
    );
  });

  test("adds worktree with override branch using -B option", async () => {
    const options: AddOptions = { B: "force-branch" };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeAdd("../path/to/worktree", { ...options, n: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree add ../path/to/worktree -B force-branch",
    );
  });

  test("derives branch from path when prefix is found", async () => {
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeAdd("../feature/add-command", { n: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree add ../feature/add-command -b feature/add-command",
    );
  });

  test("derives branch from nested path with feature prefix", async () => {
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeAdd("../some/path/bugfix/fix-issue", { n: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree add ../some/path/bugfix/fix-issue -b bugfix/fix-issue",
    );
  });

  test("derives branch with hotfix prefix", async () => {
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeAdd("../hotfix/critical-bug", { n: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree add ../hotfix/critical-bug -b hotfix/critical-bug",
    );
  });

  test("derives branch with release prefix", async () => {
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeAdd("../release/v1.0.0", { n: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree add ../release/v1.0.0 -b release/v1.0.0",
    );
  });

  test("handles path with no recognized prefix", async () => {
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeAdd("../random/path", { n: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree add ../random/path",
    );
  });

  test("prioritizes -b option over path-derived branch", async () => {
    const options: AddOptions = { b: "explicit-branch" };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeAdd("../feature/something", { ...options, n: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree add ../feature/something -b explicit-branch",
    );
  });

  test("prioritizes -B option over -b option", async () => {
    const options: AddOptions = { b: "branch-b", B: "branch-B" };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeAdd("../path", { ...options, n: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree add ../path -B branch-B",
    );
  });

  test("handles normalized paths correctly", async () => {
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeAdd("../feature/../feature/test", { n: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree add ../feature/../feature/test -b feature/test",
    );
  });

  test("handles multiple segments after prefix", async () => {
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeAdd("../feature/module/subfeature", { n: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree add ../feature/module/subfeature -b feature/module/subfeature",
    );
  });

  test("dry run does not execute git command", async () => {
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeAdd("../feature/test", { n: true });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git worktree add ../feature/test -b feature/test",
    );
  });
});
