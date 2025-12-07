#!/usr/bin/env bun
import createCli from "cac";

import { runWorktreeAdd } from "./commands/add";
import { runWorktreeList } from "./commands/list/list";

const cli = createCli("gw");

cli.option("-n, --dry-run", "Do not execute commands, just prints commands");

cli
  .command("add <path>", "Create a new worktree at path")
  .option(
    "-b <branch>",
    "Create a new branch, if not provided will derive from path",
  )
  .option("-B <branch>", "Create or reset a branch")
  .action(async (path, options) => {
    await runWorktreeAdd(path, options);
  });

cli.command("list", "Get a list of worktrees").action(async (options) => {
  await runWorktreeList(options);
});

cli.help();
cli.version("0.0.0");
cli.parse();
