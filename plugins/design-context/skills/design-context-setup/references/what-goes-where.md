# What goes where

The sorting question for anything: **does this change when the design system grows?**

If no, it can live in a file Claude reads every session. If yes, it belongs somewhere Claude fetches on request.

## The mapping

| The thing | Where it goes | Why |
|---|---|---|
| What the product is and who uses it | `CLAUDE.md` | Fixed. Claude needs it for every task |
| What it is being built in | `CLAUDE.md` | Decides units, naming, token output |
| How you make design decisions | `.claude/rules/design-principles.md` | True at 40 components and at 400 |
| Voice and tone rules | the principles rule, or `copy.md` if long | Does not change with the system |
| Rules about using tokens | `.claude/rules/using-tokens.md` | Only needed when touching styles |
| Actual token values | `tokens/tokens.json` | Grows, and gets overwritten on sync |
| What a single token is for | The token's description field in Figma | Survives sync, travels with the token |
| Rules about one component | That component's description | Arrives with the component |
| Rules about two or more together | `design/patterns/` | Too big for a component, too specific for principles |
| The component list | Nowhere. Fetch it | Grows without limit |
| What good looks like, and why | `design/exemplars/` | Annotated, capped, fetched when relevant |
| Real copy, imagery, brand files | `design/assets/` + `MANIFEST.md` | Binary costs nothing until opened |
| What you are building today | `design/specs/[screen].md` | One at a time, cleared between tasks |
| Research findings | `design/research/` | Read when pointed at |
| A method you repeat | A skill, written from a real failure | Only the description is read until needed |
| Something that must happen every time | A hook | Deterministic, not advisory |
| Accessibility requirements | `.claude/rules/accessibility.md` | Only when touching components |

## The five things people get wrong

**Writing principles into a file nothing loads.** Only `CLAUDE.md`, `CLAUDE.local.md`, `.claude/CLAUDE.md` and `.claude/rules/*.md` are loaded automatically. A `DESIGN.md` at the root is read by nobody unless someone points at it. Principles go in a rules file.

**Pasting the design system into an always-loaded file.** The most common failure. The file balloons, and the copy goes stale the moment Figma changes. Principles hold judgment. The system holds inventory.

**Writing governance into generated files.** Anything written into `tokens.css` or a generated JS file disappears on the next sync. Per-token intent goes in the token's own description field, which survives.

**Assuming split files load less.** In `CLAUDE.md`, an `@path` line pastes that file in at launch rather than fetching it later. Splitting a large file into imports reorganizes it without shrinking what gets read. Path-scoped rules files are the thing that actually reduces the load.

**Task notes in permanent files.** A line like "for the checkout redesign, use the new card variant" is true for two weeks and read forever. That belongs in a spec.

## When the designer isn't sure

Ask: would this line still be true if you added twenty components tomorrow?

Yes means it is a principle, so it can live in an always-read file.

No means it is inventory, so it gets fetched.

That question resolves nearly every case, and it is worth teaching them rather than just answering for them.
