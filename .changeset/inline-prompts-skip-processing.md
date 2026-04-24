---
"@ai-hero/sandcastle": patch
---

Inline prompts (`prompt: "..."`) are now passed to the agent literally — no `{{KEY}}` substitution, no `` !`command` `` expansion, no built-in `{{SOURCE_BRANCH}}` / `{{TARGET_BRANCH}}` injection. Fixes #453: callers that build inline prompts from arbitrary content (issue bodies, PR descriptions) no longer fail when that content happens to contain `{{...}}`. Passing `promptArgs` alongside an inline prompt is now an error; use `promptFile` to opt into template behavior.
