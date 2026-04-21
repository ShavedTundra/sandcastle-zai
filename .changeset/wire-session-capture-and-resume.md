---
"@ai-hero/sandcastle": patch
---

Wire session capture and resume through `run()` for Claude Code:

- **Capture:** after each iteration, the agent's session JSONL is transferred from the sandbox to the host at `~/.claude/projects/<encoded>/sessions/<id>.jsonl` with `cwd` fields rewritten to the host repo root. Adds `captureSessions` option to `claudeCode()` (default `true`) and `sessionFilePath` to `IterationResult`.
- **Resume:** adds `resumeSession` option to `run()` for continuing prior Claude Code conversations in new sandbox runs. Validates the session file exists and is incompatible with `maxIterations > 1`. Transfers session JSONL from host to sandbox with `cwd` rewriting before iteration 1.
