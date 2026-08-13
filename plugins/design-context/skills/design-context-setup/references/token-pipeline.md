# The token pipeline

One direction: **Figma is the source of truth, code consumes.** Every problem in a token pipeline comes from someone editing the wrong end.

```
Figma variables  →  tokens.json (DTCG)  →  build  →  platform output
     ^                                                      |
     └──────────── edits happen here only ──────────────────┘
```

## Contents

- The format
- Getting tokens out of Figma
- Building platform output
- Where meaning lives
- Known gaps
- The rules file that goes with it

## The format

DTCG — the W3C Design Tokens Community Group format, first stable revision 2025.10. Use it rather than a bespoke JSON shape; it is what tooling now expects.

```json
{
  "color": {
    "$type": "color",
    "brand": { "$value": "#1f6f5c", "$description": "Primary. Route markers and the play control." },
    "action": { "$value": "{color.brand}", "$description": "Anything tappable." }
  }
}
```

- `$value` is required. Everything else is optional.
- `$type` can be set once on a group and inherited by its children.
- `$description` is plain text explaining the token's purpose.
- `{group.token}` is an alias — it resolves to the target's whole value.
- Extension `.tokens.json` (or `.tokens`), media type `application/design-tokens+json`.
- Groups are just objects without a `$value`.

## Getting tokens out of Figma

**Figma Console MCP** — `figma_export_tokens` handles this on any plan, including free, and supports both DTCG dialects with a dry-run preview. It can also import library variables without Enterprise access, which is otherwise gated. `figma_import_tokens` goes the other way when tokens need to be pushed back.

**Plugins** are the fallback if no MCP is connected. Token Studio and similar will export DTCG.

Either way the export is generated output. It gets overwritten on the next sync, so nothing hand-written survives there.

## Building platform output

Style Dictionary is the default build step. What it emits should match the answer to interview question 5:

| Built in | Output |
|---|---|
| React / web | CSS custom properties, or Tailwind theme |
| React Native | a TS/JS theme object |
| Swift / SwiftUI | a Swift constants file |
| Flutter | a Dart theme |
| Nothing yet | stop at `tokens.json` and note the TODO |

Generated output is never hand-edited and usually not worth reviewing line by line. Whether it is checked into git depends on whether the build runs in CI — if it does not, commit it so the app always has something to consume.

## Where meaning lives

**What a token is *for* goes in its `$description` in Figma**, not in a file in the repo. The description survives the sync and travels with the token. Anything written into generated output disappears on the next export.

This is also the highest-leverage thing most designers can do to their system. Descriptions are what let Claude answer "which token do I use here" without asking — and most libraries have them on maybe half the variables.

**Semantic over literal, and let the alias chain carry the meaning.** `color.action` aliased to `color.brand` says something `color.green.600` never will. The alias chain is where the design decision is recorded.

## Known gaps

Composite tokens — typography, shadows, gradients — still export incompletely from Figma despite being in the stable spec. Expect to hand-hold those, and tell the designer up front so they read it as a tool limitation rather than their own mistake.

## The rules file that goes with it

Once there is code, add `.claude/rules/using-tokens.md`, scoped so it only loads when styles are being touched:

```markdown
---
paths:
  - "src/styles/**"
  - "**/*.{css,scss}"
---

# Using tokens

- Never a raw value. If no token fits, say so and propose one.
- Reference semantic tokens, not the primitives they alias to.
- tokens.json is generated. Change it in Figma and re-export.
```

Under 40 lines. Until there is code to scope it to, this belongs on the map as *later*, with that as the trigger.
