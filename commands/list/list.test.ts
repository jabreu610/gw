import { describe, expect, test, mock, beforeEach } from "bun:test";
import { runWorktreeList } from "./list";
import type { ListOptions } from "./list.types";

describe("runWorktreeList", () => {
  beforeEach(() => {
    mock.restore();
  });

  test("dry run prints command without executing", async () => {
    const options: ListOptions = { dryRun: true };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeList(options);

    expect(consoleSpy).toHaveBeenCalledWith("Running: git worktree list");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
