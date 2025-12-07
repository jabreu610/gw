import { describe, expect, test, mock, beforeEach } from "bun:test";
import { mockState } from "./list.preload";
import { runWorktreeList } from "./list";
import type { ListOptions } from "./list.types";

// Helper to strip ANSI escape codes from strings
function stripAnsi(str: string): string {
  return str.replace(/\u001B\[\d+m/g, "");
}

describe("runWorktreeList", () => {
  beforeEach(() => {
    // Reset mock state before each test
    mockState.worktreeOutput = [];
    mockState.currentBranch = "main";
    mockState.shouldThrowError = false;
    mockState.errorType = "none";
  });

  test("dry run prints command without executing", async () => {
    const options: ListOptions = { dryRun: true };
    const consoleSpy = mock(() => {});
    console.log = consoleSpy;

    await runWorktreeList(options);

    expect(consoleSpy).toHaveBeenCalledWith(
      "dryrun: git branch --show-current",
    );
    expect(consoleSpy).toHaveBeenCalledWith("dryrun: git worktree list");
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });

  test("lists single worktree with branch", async () => {
    mockState.worktreeOutput = ["/path/to/repo abc1234 [main]"];
    mockState.currentBranch = "main";

    const options: ListOptions = { dryRun: false };
    const calls: string[] = [];
    console.log = mock((msg: string) => {
      calls.push(msg);
    });

    await runWorktreeList(options);

    const output = calls.map(stripAnsi).join("\n");
    expect(output).toContain("Branches 1");
  });

  test("groups worktrees by branch prefix", async () => {
    mockState.worktreeOutput = [
      "/path/to/feature abc1234 [feature/login]",
      "/path/to/bugfix def5678 [bugfix/navbar]",
      "/path/to/main 9876543 [main]",
    ];
    mockState.currentBranch = "main";

    const options: ListOptions = { dryRun: false };
    const calls: string[] = [];
    console.log = mock((msg: string) => {
      calls.push(msg);
    });

    await runWorktreeList(options);

    const output = calls.map(stripAnsi).join("\n");
    expect(output).toContain("Bugfix 1");
    expect(output).toContain("Feature 1");
    expect(output).toContain("Branches 1");
  });

  test("highlights current branch with star", async () => {
    mockState.worktreeOutput = [
      "/path/to/feature abc1234 [feature/login]",
      "/path/to/main 9876543 [main]",
    ];
    mockState.currentBranch = "feature/login";

    const options: ListOptions = { dryRun: false };
    const calls: string[] = [];
    console.log = mock((msg: string) => {
      calls.push(msg);
    });

    await runWorktreeList(options);

    const output = calls.map(stripAnsi).join("\n");
    expect(output).toContain(" ★ ");
  });

  test("handles bare repository", async () => {
    mockState.worktreeOutput = [
      "/path/to/repo (bare)",
      "/path/to/main abc1234 [main]",
    ];
    mockState.currentBranch = "main";

    const options: ListOptions = { dryRun: false };
    const calls: string[] = [];
    console.log = mock((msg: string) => {
      calls.push(msg);
    });

    await runWorktreeList(options);

    const output = calls.map(stripAnsi).join("\n");
    expect(output).toContain("Bare 1");
  });

  test("handles empty lines in output", async () => {
    mockState.worktreeOutput = [
      "/path/to/main abc1234 [main]",
      "",
      "/path/to/feature def5678 [feature/test]",
    ];
    mockState.currentBranch = "main";

    const options: ListOptions = { dryRun: false };
    const calls: string[] = [];
    console.log = mock((msg: string) => {
      calls.push(msg);
    });

    await runWorktreeList(options);

    const output = calls.map(stripAnsi).join("\n");
    expect(output).toContain("Branches 1");
    expect(output).toContain("Feature 1");
  });

  test("handles malformed worktree output in unknown group", async () => {
    mockState.worktreeOutput = [
      "/path/to/main abc1234 [main]",
      "some malformed line",
    ];
    mockState.currentBranch = "main";

    const options: ListOptions = { dryRun: false };
    const calls: string[] = [];
    console.log = mock((msg: string) => {
      calls.push(msg);
    });

    await runWorktreeList(options);

    const output = calls.map(stripAnsi).join("\n");
    expect(output).toContain("Unknown 1");
  });

  test("sorts groups with bare first and unknown last", async () => {
    mockState.worktreeOutput = [
      "/path/to/feature abc1234 [feature/test]",
      "malformed",
      "/path/to/repo (bare)",
      "/path/to/main def5678 [main]",
    ];
    mockState.currentBranch = "main";

    const options: ListOptions = { dryRun: false };
    const calls: string[] = [];
    console.log = mock((msg: string) => {
      calls.push(msg);
    });

    await runWorktreeList(options);

    const strippedCalls = calls.map(stripAnsi);
    const bareIndex = strippedCalls.findIndex((c) => c.includes("Bare"));
    const unknownIndex = strippedCalls.findIndex((c) => c.includes("Unknown"));
    expect(bareIndex).toBeLessThan(unknownIndex);
  });

  test("lists multiple branches in same category", async () => {
    mockState.worktreeOutput = [
      "/path/to/main abc1234 [main]",
      "/path/to/feature1 def5678 [feature/login]",
      "/path/to/feature2 abc9012 [feature/signup]",
      "/path/to/feature3 def3456 [feature/profile]",
    ];
    mockState.currentBranch = "main";

    const options: ListOptions = { dryRun: false };
    const calls: string[] = [];
    console.log = mock((msg: string) => {
      calls.push(msg);
    });

    await runWorktreeList(options);

    const output = calls.map(stripAnsi).join("\n");
    expect(output).toContain("Feature 3");
    expect(output).toContain("feature/login");
    expect(output).toContain("feature/signup");
    expect(output).toContain("feature/profile");
    expect(output).toContain("Branches 1");
  });
});
