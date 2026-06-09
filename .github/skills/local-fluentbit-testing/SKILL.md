---
name: local-fluentbit-testing
description: Validate nr-funbucks generated Fluent Bit configuration against the local mock Lambda workflow; use when asked to test generated config, troubleshoot missing logs, or run a local end-to-end Fluent Bit check
argument-hint: Optionally specify the server, app id, and whether to use the full container flow or direct HTTP-only validation
---

# Local Fluent Bit Testing

Use this skill when the user asks to validate generated Fluent Bit output locally, confirm a config change works end to end, or debug why logs are not reaching the mock processor.

## Goal

Exercise the smallest realistic local workflow for the changed config and report whether generation, local transport, and downstream processing behave as expected.

## Prefer this order

1. Target one server and one app when possible.
2. Generate config locally with `./bin/dev gen -l -s <server> -a <appId>`.
3. Use the direct HTTP check only when Fluent Bit container execution is unnecessary.
4. Use the full container flow when the task depends on file paths, parsers, filters, or generated Fluent Bit wiring.

## Prerequisites

- `nr-funbucks` dependencies installed.
- Podman available for the containerized flow.
- The sibling repo `../nr-apm-stack/event-stream-processing` available for the local mock Lambda server.
- Test input files placed under `lambda/data/` in the paths expected by generated `inputs.conf`.

## Workflow

### 1. Generate the narrowest config

- Prefer `./bin/dev gen -l -s <server> -a <appId>` for one application.
- Use `./bin/dev gen -l -s <server>` only when the task depends on whole-server behavior.
- Use `-m` only when the server exceeds Fluent Bit limits and the task specifically needs multi-agent output.

### 2. Choose a validation path

Containerized end-to-end path:
- Start the local processor from `../nr-apm-stack/event-stream-processing`.
- Run `./lambda/podman-run.sh` from `nr-funbucks`.
- Check both the processor output and Fluent Bit container output for parse or transport failures.

HTTP-only path:
- Start the local processor from `../nr-apm-stack/event-stream-processing`.
- Send representative sample payloads directly to `http://localhost:3000`.
- Use this only when validating downstream processing behavior without needing Fluent Bit to read files.

### 3. Interpret failures locally

- If generation fails, inspect the changed server or template JSON first.
- If Fluent Bit starts but sends nothing, compare generated `output/inputs.conf` paths against `lambda/data/`.
- If parsing fails, inspect the app template and generated filters or parsers before widening scope.
- If the local processor receives data but fails processing, report that the generator likely worked and the downstream stack needs attention.

## Evidence to report

- The exact generation command used.
- Whether validation used containerized flow or HTTP-only flow.
- Which server and app were exercised.
- Whether logs were generated, sent, and processed successfully.
- The first concrete failure point when the workflow fails.

## References

- [README.md](README.md): full local testing workflow, sample commands, and troubleshooting.
- [AGENTS.md](AGENTS.md): repo-wide commands and validation guidance.