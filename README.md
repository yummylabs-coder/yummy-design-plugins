# Yummy Design — Claude Code plugins

Design tooling for Claude Code, built for designers rather than for engineers who happen to design.

## Install

```
/plugin marketplace add yummylabs-coder/yummy-design-plugins
/plugin install design-context@yummy-design
```

Then, in any project:

```
/design-context:design-context-setup
```

Claude also reaches for it on its own when you ask something like "how should I structure this project" in an empty folder.

To update later:

```
/plugin marketplace update yummy-design
```

## What's in it

### `design-context`

Most designers know their product and their design rules perfectly well. What they don't know is which file each piece belongs in, and that uncertainty is enough to stop them setting anything up at all.

This walks through it in seven phases:

1. **Interview** — plain language, one question at a time
2. **Connections** — which MCP servers actually matter, and which Figma server given your seat
3. **The map** — the whole scaffold shown at once, with markers for *have it / do now / later / not for you*
4. **Read what you have** — pulls your real Figma variables and diagnoses them, instead of asking you to describe your rules from memory
5. **Draft the files** — one at a time, short, never inventing a rule you didn't give
6. **Verification** — the loop that lets Claude check its own work against your design
7. **What comes next** — triggers, so the setup grows from real failures

It works with no MCP connections, no codebase, and no design system.

## Developing

Test changes before pushing by adding the marketplace from a local path:

```
/plugin marketplace add ./yummy-design-plugins
/plugin install design-context@yummy-design
```

The skill itself lives at `plugins/design-context/skills/design-context-setup/`. Keep `SKILL.md` short and put detail in `references/` — the skill is about avoiding context bloat and should not cause any.
