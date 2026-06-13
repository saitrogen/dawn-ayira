---
name: multi-agent-cli
description: >
  Orchestrate agy (antigravity CLI), GitHub Copilot CLI, and Claude Code sub-agents
  to parallelize work, reduce token costs, and leverage each tool's strengths.
  Use this skill whenever the user is working in a terminal/Claude Code session and
  mentions agy, copilot CLI, sub-agents, delegating tasks, cutting token costs,
  parallelizing work, or wants to distribute work across multiple AI CLIs.
  Also triggers when the user says things like "use agy for this", "have copilot do X",
  "run agents in parallel", or "offload this task".
---

# Multi-Agent CLI Orchestration

Orchestrate `agy`, `copilot`, and `claude` sub-agents from within a Claude Code session
to parallelize work, isolate context, and cut token costs.

---

## Core Principle

Claude Code is the **orchestrator**. It holds the plan, delegates scoped tasks to sub-agents
via bash subprocesses, collects outputs, and synthesizes results. Sub-agents each get a small,
isolated context — which is where token savings come from.

```
Claude Code (orchestrator)
├── agy -p "..."                     → Anthropic-based, isolated code/file tasks
├── copilot -p "..." --allow-all -s  → GPT-based, git/repo/GitHub ops
└── claude --print "..."             → Claude sub-agent for parallel reasoning tasks
```

---

## Agent Roles & When to Delegate

### `agy` — Isolated code tasks
Best for single-file transforms, refactors, boilerplate generation, content transforms.
```bash
agy -p "refactor auth.ts to use async/await throughout"
agy -p "add JSDoc to every exported function in utils.ts"
cat src/schema.ts | agy -p "generate zod validators for every type in this file"
```
Key flags:
- `-p` / `--print` — non-interactive, exits after task
- `--dangerously-skip-permissions` — required for unattended use

### `copilot` — Git, repo, and GitHub operations
Best for git history analysis, commit messages, PR summaries, shell command generation.
Copilot has a built-in GitHub MCP server.
```bash
copilot -p "write a conventional commit message for this diff: $(git diff --staged)" \
  --allow-all --silent
copilot -p "summarize what changed in the last 10 commits affecting auth/" \
  --allow-all --silent
copilot -p "find all TODO comments in the repo and list them by file" \
  --allow-all --silent
```
Key flags:
- `-p` — non-interactive prompt
- `--allow-all` / `--yolo` — auto-approve all permissions (required for unattended)
- `--silent` / `-s` — suppress stats, clean output for piping
- `--output-format json` — structured output when parsing results

### `claude --print` — Parallel Claude sub-agents
Best for tasks that need Claude reasoning but should stay isolated from the main session.
```bash
claude --print "given this interface: $(cat types/user.ts), write mock data for tests"
```

---

## Token-Saving Patterns

### Pipe instead of loading into context
```bash
# Don't paste bigfile.ts into your Claude Code session
cat src/bigfile.ts | agy -p "list all exported symbols and their types" > .tmp/symbols.txt
# Now Claude Code reads .tmp/symbols.txt (small) instead of bigfile.ts (large)
```

### Parallel agents
```bash
# Fire multiple agents simultaneously, wait for all to finish
agy -p "write unit tests for auth.ts" --dangerously-skip-permissions > tests/auth.test.ts &
agy -p "write unit tests for user.ts" --dangerously-skip-permissions > tests/user.test.ts &
agy -p "write unit tests for api.ts" --dangerously-skip-permissions > tests/api.test.ts &
wait
echo "All test files generated"
```

### Summary chaining
```bash
# Step 1: agy summarizes a large file
cat src/large-module.ts | agy -p "summarize: what does this module do, what are its deps, what does it export" > .tmp/module-summary.txt

# Step 2: Claude Code reads the summary, not the source
# "Based on .tmp/module-summary.txt, now plan the refactor..."
```

### Copilot for git context (its native strength)
```bash
# Get a smart commit message without loading the diff into Claude Code
MSG=$(copilot -p "write a conventional commit message for: $(git diff --staged)" --allow-all --silent)
git commit -m "$MSG"
```

---

## CLAUDE.md Template

Drop this into a project's `CLAUDE.md` to bake the delegation rules in permanently:

```markdown
## Sub-Agent Delegation

This project uses agy, copilot CLI, and claude sub-agents. Delegate as follows:

### → agy -p "<task>" --dangerously-skip-permissions
- Single-file refactors and transforms
- Boilerplate generation from a spec
- Content transforms (pipe file via stdin)

### → copilot -p "<task>" --allow-all --silent
- Git ops: commit messages, log analysis, diff summaries
- GitHub-specific queries (has built-in GitHub MCP)
- Shell command generation for repo operations

### → claude --print "<task>"
- Reasoning tasks that need Claude but must stay context-isolated
- Parallel workstreams

### Keep in THIS session (Claude Code)
- Orchestration and planning
- Cross-file architectural decisions
- Final review and synthesis of sub-agent outputs
- Anything requiring full project context
```

---

## Safety Notes

- Always use `--dangerously-skip-permissions` (agy) or `--allow-all` (copilot) when calling
  sub-agents non-interactively, otherwise they'll hang waiting for human confirmation.
- For destructive file ops, review sub-agent output before writing: pipe to a `.tmp/` file first,
  inspect, then `mv` into place.
- `copilot --yolo` is an alias for `--allow-all` — same thing, shorter.

---

## Quick Reference

| Task type | Agent | Command pattern |
|---|---|---|
| Single-file refactor | agy | `agy -p "..." --dangerously-skip-permissions` |
| Multi-file parallel gen | agy | `agy ... & agy ... & wait` |
| Pipe file content | agy | `cat file \| agy -p "..."` |
| Git/commit messages | copilot | `copilot -p "..." --allow-all -s` |
| GitHub repo queries | copilot | `copilot -p "..." --allow-all -s` |
| Claude reasoning, isolated | claude | `claude --print "..."` |
| Summarize before loading | any | pipe to `.tmp/`, read summary |