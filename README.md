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

### List Command

Display all Git worktrees organized by branch prefix:

```bash
gw list
```

**Options:**

- `-n, --dry-run` - Print command without executing it

**Features:**

- Groups worktrees by branch prefix (e.g., `feature/`, `bugfix/`)
- Highlights current branch with a star (★) indicator
- Shows path, commit hash, and branch name for each worktree
- Displays count of worktrees in each group
- Handles bare repositories and malformed entries

**Example Output:**

```
Bare 1
   /path/to/repo (bare)

Feature 2
 ★ /path/to/feature/login abc1234 feature/login
   /path/to/feature/signup def5678 feature/signup

Main 1
   /path/to/main 9876543 main
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
