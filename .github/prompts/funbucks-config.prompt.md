---
name: funbucks-config
description: Add or update nr-funbucks server, app, or template configuration with minimal targeted validation
argument-hint: Describe the server, app, template, or config change to make
---

Use this prompt when the task is to add or update nr-funbucks configuration in `config/`.

Scope:
- Edit only configuration files unless the request explicitly requires a related customization file.
- Prefer `config/server/*.json` and `config/templates/*/*.json` over generated output.
- Keep the change local and follow neighboring examples in the same file.

Required context to resolve before editing:
- Which server or template file is the target.
- Whether this is a new app entry, an update to an existing app, or a template definition change.
- Which template `type` the server app should reference.
- Whether the change must also support OpenShift packaging via `oc`.

Workflow:
1. Inspect the target config file and one nearby example with the same template type.
2. Make the smallest config change that satisfies the request.
3. If adding an app entry, choose a stable `id` when the entry will be validated or targeted with `-a`.
4. Validate with the cheapest relevant command:
   - `./bin/dev gen -s <server>`
   - `./bin/dev gen -l -s <server> -a <appId>` for a focused local check
   - `./bin/dev oc -s <server>` when OpenShift packaging is affected
5. Summarize what changed, which config file now owns the behavior, and the validation result.

Use [README.md](README.md) for the full local testing workflow and [AGENTS.md](AGENTS.md) for repo-wide conventions.