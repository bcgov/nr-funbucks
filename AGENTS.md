# NR Funbucks Agent Guide

Use this file when working anywhere in this repository. Keep changes small and match the existing TypeScript and oclif CLI patterns.

## What this repo is

- `nr-funbucks` is an oclif CLI that generates Fluent Bit configuration from JSON server definitions and Nunjucks templates.
- The main user commands are in [src/commands/gen.ts](src/commands/gen.ts) and [src/commands/oc.ts](src/commands/oc.ts).
- Core generation flow lives in [src/services/generator.service.ts](src/services/generator.service.ts), [src/services/render.service.ts](src/services/render.service.ts), and [src/services/repackage.service.ts](src/services/repackage.service.ts).

## Key working areas

- `config/server/`: server and application inventory used as generation input.
- `config/templates/`: template definitions and Nunjucks assets.
- `src/util/types.ts`: shared config and rendering types.
- `src/constants/limits.ts`: Fluent Bit resource caps; preserve these constraints unless the task explicitly changes them.
- `output/` and `output_pack/`: generated artifacts. Do not hand-edit generated output unless the task is specifically about generated files.

## Commands agents should use

- `npm run build`: TypeScript build.
- `npm run lint`: ESLint for `src/**/*.ts`.
- `npm test`: Mocha test command. The repo currently has test tooling configured but little or no committed test coverage, so lint and targeted manual checks are often the practical validation path.
- `./bin/dev gen -l -s localhost`: generate local test output into `output/`.
- `./bin/dev oc -s <server>`: create OpenShift packaging output in `output_pack/`.

## Repo-specific conventions

- Follow the existing oclif command pattern: define flags with `Flags.*`, parse in `run()`, and delegate behavior into services.
- Treat the JSON config files as the source of truth. Prefer fixing generation logic or template data flow rather than editing generated config output.
- Context overrides use `key//value` syntax, and app-scoped overrides use `appId:key//value`; preserve this format when changing parsing or documentation.
- `gen -m` exists to split output across multiple Fluent Bit agents when filter, input, or parser counts exceed the hard caps.
- Keep user-facing CLI text concise and factual.

## Validation guidance

- Start with the cheapest focused check for the area you changed: `npm run lint`, `npm run build`, or a targeted `./bin/dev gen ...` invocation.
- For generator or template changes, prefer validating by generating output for one server or one app instead of broad repo-wide edits.
- For local end-to-end Fluent Bit testing, follow the workflow already documented in [README.md](README.md).

## Useful references

- [README.md](README.md): generation workflow, local Lambda testing, troubleshooting, and config format details.
- [CONTRIBUTING.md](CONTRIBUTING.md): contribution and commit conventions.
- [.github/workflows/ci.yml](.github/workflows/ci.yml): current CI only installs dependencies and runs lint.

## Avoid

- Do not introduce new frameworks or abstractions unless the existing CLI/service structure cannot support the task.
- Do not duplicate large sections of the README in code comments or new instruction files; link to the README instead.
- Do not assume generated output is authoritative over the `config/` and `src/` inputs.