# Growing the setup

The scaffold is the starting position, not the destination. This file is what turns the *later* markers on the map into things that actually get built.

Nothing here is created during setup. Every item has a trigger, and the trigger is always **observed failure**, never anticipation.

## Contents

- Triggers
- Writing a skill from a failure
- The critic agent
- Hooks
- Auto memory
- The pruning pass

## Triggers

| Add this | When |
|---|---|
| A rule in `.claude/rules/` | you have corrected the same thing twice |
| A skill | you have explained the same *process* three times |
| An agent | you want a second opinion that is not biased by the work |
| A hook | something must happen every time, with no exceptions |
| A spec | you are starting a real screen |
| A pattern file | you explained how two components behave together |
| An exemplar | you said "like that, but…" and had to describe it |
| `using-tokens.md` | there is code to scope it to |
| Verification | there is something buildable to look at |

The distinction that matters most: **a rule is a fact, a skill is a procedure.** "Never use a raw hex" is a rule. "How we write an audio guide script" is a skill.

## Writing a skill from a failure

Do not write skills from imagination. The best source is the transcript of the session where Claude got it wrong.

1. Finish the task the hard way, correcting as you go
2. Notice what you had to explain that you will have to explain again
3. Ask Claude to write the skill **from this session**, naming what it got wrong
4. Review it for invented content — cut anything you did not actually say
5. Use it on the next similar task and watch where it still struggles

Two things to check before writing anything:

**Does a general skill already cover it?** There are strong installed skills for UX, UI, copy, motion and data visualisation. Do not rebuild them. The project skill is a thin layer on top.

**Is it specific to this product?** That is where the value is. A generic copy skill is worth little. A skill that knows the copy is *spoken, not read* — paced to walking speed, no "as you can see", place names with pronunciation, length tied to the walk between stops — is worth a lot, and nothing general covers it.

## The critic agent

The one agent that earns its place for a solo designer. It reviews in a fresh context, so it is not defending work it just produced.

```markdown
---
name: design-critic
description: Reviews a screen against the spec, the principles and the exemplars
tools: Read, Grep, Glob
---

Review the screen named in the request. Read the relevant file in
design/specs/, .claude/rules/design-principles.md, and
design/exemplars/README.md first.

Flag only what breaks a stated requirement or a principle. Say what
is wrong, where, and what it should be instead. Style preferences
that break no stated rule are not findings.
```

It does not inherit the conversation or auto memory, so the file has to point it at its own sources. And it needs the scoping line — a reviewer asked for problems always finds problems, and unscoped it generates busywork that reads like rigour.

## Hooks

Advisory instructions get followed most of the time. Hooks run every time. For a design project there are only two worth having, and both only once there is code:

- Rebuild tokens when `tokens.json` changes
- Block writes to generated output, so nobody edits the wrong end of the pipeline

Everything else is better as a rule.

## Auto memory

Claude keeps its own notes per project and loads an index of them each session. This matters here for one reason: **do not hand-write what Claude already saved.** Corrections given in conversation often persist on their own.

`/memory` shows what is stored. Worth a look before adding a rule — it may already be handled.

The division: auto memory is what Claude noticed, `CLAUDE.md` and rules are what the designer decided. Keep the deliberate ones deliberate.

## The pruning pass

Setups rot by accumulation, and nothing announces itself as the problem. Once in a while:

- **A rule that never changes anything** — delete it, or make it a hook
- **Exemplars that stopped being aspirational** — replace, do not accumulate. Five to seven live
- **MCP servers unused for a week** — disconnect. They cost something on every task
- **Specs for shipped screens** — archive them; they read as current forever otherwise
- **A `CLAUDE.md` Claude seems to ignore** — that is the symptom of a file too long, not a rule too weak. The fix is cutting, not adding emphasis

The test for every remaining line stays the same: *would removing this cause Claude to make a mistake?*
