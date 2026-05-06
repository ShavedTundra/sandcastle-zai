---
"@ai-hero/sandcastle": patch
---

Fix Windows Docker mount errors — switch from -v to --mount type=bind syntax and add patchGitMountsForWindows to createSandbox
