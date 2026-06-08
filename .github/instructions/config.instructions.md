---
applyTo: 'config/**'
description: Guidance for editing nr-funbucks server and template configuration files under config/
---

# Funbucks config guidance

- Treat `config/server/*.json` and `config/templates/*/*.json` as the source of truth for generated output. Prefer changing config or templates over editing `output/` or `output_pack/`.
- Match the style of the surrounding file. Many server files use compact inline app objects for simple entries and expanded objects only when context is larger.
- Preserve existing key order unless there is a clear local pattern to follow. In server files, keep top-level deployment fields together, then `apps`, then shared `context`, then optional `oc` packaging data.
- When adding or changing an app entry, verify that `type` matches an existing template folder under `config/templates/`. Reuse neighboring apps of the same type as the primary example.
- Use stable, unique `id` values for app entries when the app may be targeted with `./bin/dev gen -a <id>`. Some local-only examples omit `id`; do not normalize unrelated entries just to make shapes match TypeScript.
- Keep context overrides minimal. Prefer only the keys needed for that server or app, and preserve existing special keys such as `!logs_path_app` when the template expects them.
- For OpenShift servers, preserve the `oc` block shape and templated Helm expressions. Do not rewrite those strings unless the packaging behavior itself is part of the task.
- For template config files, keep the folder name, JSON filename, and template `type` references aligned. Preserve `measurementType`, optional `os`, optional `semver`, and the `files` list structure.
- Validate config edits with the narrowest command that exercises the changed file: `./bin/dev gen -s <server>`, add `-l` for local testing, add `-a <id>` when checking one app, and run `./bin/dev oc -s <server>` if the change affects OpenShift packaging.
- Use [README.md](README.md) for the full local testing workflow instead of restating it in config comments or new docs.