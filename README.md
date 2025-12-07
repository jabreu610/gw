# gw

A Git worktree CLI tool built with Bun.

## Installation

```bash
bun install
```

## Usage

The `gw` CLI provides commands for managing Git worktrees.

### Add Command

Create a new Git worktree at the specified path:

```bash
gw add <path>
```

**Options:**

- `-b <branch>` - Create a new branch (if not provided, will derive from path)
- `-B <branch>` - Create or reset a branch
- `-n, --dry-run` - Print commands without executing them

**Examples:**

```bash
# Create a worktree with auto-derived branch name
gw add ../feature/new-feature

# Create a worktree with specific branch
gw add ../bugfix -b fix-login-issue

# Dry run to see what would be executed
gw add ../feature/test --dry-run
```

## Development

This project uses [Bun](https://bun.sh) as its runtime.

To run the CLI locally:

```bash
bun run index.ts add <path>
```

To run tests:

```bash
bun test
```
