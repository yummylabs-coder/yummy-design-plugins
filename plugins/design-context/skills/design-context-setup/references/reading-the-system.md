# Reading what they already have

Do this **before** drafting any rules file, whenever a design system exists and a Figma server is connected.

Asking a designer "what are your colour rules" asks them to compose from memory. They know it when they see it. Show them their own system and ask what is wrong instead — that is a review, and reviews are easy.

This phase also produces something more valuable than the rules file: a design system Claude can actually read. Every description added here is a question nobody has to answer again.

## Contents

- What to pull
- What to report back
- The three polish moves
- Turning findings into rules
- When nothing is connected

## What to pull

Read, do not dump. The point is a diagnosis, not an inventory.

- Variable collections, and the modes on them
- How many variables exist, and **how many have descriptions**
- The naming pattern — literal (`green/600`) or semantic (`color.action`)
- Whether there is an alias layer at all, or only primitives
- Components, and whether they have descriptions
- Whether the library is published or local

## What to report back

Four or five lines. Numbers, then the diagnosis:

> 47 colour variables across two collections. 12 have descriptions.
> Naming is literal — `green/600`, `green/700` — with no semantic layer,
> so nothing in the file says which one is the action colour. That is
> why colour gets applied inconsistently: there is no right answer to
> find, only a nearest match.

That paragraph is worth more than any question, because now the designer is correcting a finding instead of inventing a rule.

## The three polish moves

In order of leverage. Do one at a time, in batches the designer can react to.

**1. Descriptions.** The highest-value work in the whole setup. A description says what the token is *for*, survives every sync, and travels with the token. It is what lets Claude choose correctly without asking.

Propose ten at a time, in a list, and let them correct:

```
color.brand      → "Primary. Route markers and the play control."
color.surface.2  → "Cards on top of the map. Never full-screen."
```

**2. A semantic layer.** `color.action` aliased to `{color.green.600}`. The alias chain is where the design decision is recorded — a literal name carries no decision at all, which is exactly why a model picks the wrong one. Propose the semantic names from how the tokens are actually used, and let the designer cut what is wrong.

**3. DTCG-shaped structure.** Groups, `$type` set once and inherited, aliases in `{group.token}` form. This is what makes the export clean. See `token-pipeline.md`.

Two guardrails: never rewrite a live library silently, and work on a duplicate until the designer trusts the tooling. Console runs Plugin API code against the real file.

## Turning findings into rules

**The gap you found is the rule.** Do not invent one — name the gap.

Found no semantic layer? The rule is not an invented colour philosophy. It is:

```markdown
## Colour
- There is no semantic colour token yet. Ask before choosing one —
  a near match is always wrong here.
> TODO: build color.action / color.surface aliases, then replace this rule.
```

That is honest, it is useful immediately, and it points at the fix.

## When nothing is connected

Do not fall back to abstract questions. Anchor on an artifact instead:

- Ask them to paste a frame, or a screenshot of a screen they think is right, and derive the rule from it
- Ask them to paste their variable list, and react to that

If there is genuinely nothing to look at, write the TODO with what it needs and **move on to the next file**. Never end a turn blocked on a question the designer cannot answer cold. Come back to it when there is something to look at.
