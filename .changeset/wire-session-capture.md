---
"@ai-hero/sandcastle": patch
---

Wire session capture through run(): after each Claude Code iteration, the agent's session JSONL is transferred from the sandbox to the host at `~/.claude/projects/<encoded>/sessions/<id>.jsonl` with `cwd` fields rewritten to the host repo root. Adds `captureSessions` option to `claudeCode()` (default `true`) and `sessionFilePath` to `IterationResult`.
