---
name: design-context-setup
description: "Sets up a complete design context scaffold for a new or existing project by interviewing the designer in plain language, recommending which MCP servers to connect, showing the full scaffold as a map, then creating and drafting the files one at a time. Use when starting a new project with Claude, when a designer asks 'how should I structure this', 'set up my project', 'set up my design context', 'what files do I need', 'help me get started with Claude Code', 'create my CLAUDE.md', 'which MCPs should I connect', or when someone has an empty folder and wants Claude to work well in it. Also use when an existing setup has grown messy and needs reorganizing. Works with no MCP connections, no codebase, and no design system. Do NOT use for building UI, writing components, or design system audits."
user-invocable: true
---

# Design Context Setup

Most designers know their product and their design rules perfectly well. What they don't know is which file each piece belongs in, and that uncertainty is enough to stop them setting anything up at all.

This skill removes that decision. Ask questions in plain language, connect what changes what's possible, show the whole scaffold as a map so they can see the shape, then draft each file together, one at a time, so the designer is always reacting to something rather than facing an empty page.

## Critical: the four rules that keep this from backfiring

**Every file stays short.** The entire point of this structure is that the always-loaded files stay small. A generated 300-line rules file recreates the problem it was meant to solve. The test for every line, from Anthropic's own guidance: *would removing this cause Claude to make a mistake?* If not, cut it. Target under 200 lines for `CLAUDE.md` and about 40 for a rules file.

**Show them something, never ask them to compose.** The designer reacts; they do not fill in blanks. "What are your colour rules?" is a blank page with a question mark on it, and nobody can answer it cold. If a system is connected, go and read it, then ask what is wrong with what you found. If nothing is connected, anchor on an artifact — a pasted frame, a variable list. One question per file, maximum, and always attached to something concrete.

**Never invent the designer's rules.** Draft from what they told you. Where something is genuinely missing, write a `TODO` line saying what's needed and why, rather than filling it with plausible-sounding defaults. A file with three real rules and four honest TODOs is more useful than one with twelve invented ones.

**Know which directories are live.** `.claude/rules/`, `.claude/skills/` and `.claude/agents/` are loaded or discovered by Claude automatically. A stub file there is not a placeholder, it is a live instruction that fires on real work. In those directories a not-yet slot is **a line in a README**, never a stub file. Everywhere else (`design/`, `tokens/`) placeholders are inert and safe.

**Only `CLAUDE.md` and `.claude/rules/` load automatically.** A file named `DESIGN.md` at the root is read by nobody. Principles belong in `.claude/rules/design-principles.md`, which does load, every session.

## Phase 1: The interview

Ask these, one at a time, conversationally. Wait for each answer. Do not present them as a form.

1. What are you working on? A couple of sentences is plenty.
2. Do you have a design system yet, or are you starting fresh?
3. If you have one, where does it live? Figma, Storybook, code, a doc somewhere?
4. Is it just you on this, or are there other people?
5. **What is this being built in, or what will it be built in?** React, React Native, Swift, Flutter, a no-code tool, or genuinely unknown yet.
6. **What have you already got connected?** Any MCP servers, a repo, a CMS.
7. What do you find yourself explaining to Claude over and over?

Question 7 matters most. Whatever they repeat is, by definition, something that should be written down once. Everything they say here goes straight into a file.

Question 5 is what stops the design being built in a silo. The answer decides token output format, units, component naming, and whether Code Connect is possible. "I don't know yet" is a valid answer worth recording as a TODO.

Then ask follow-ups only where their answers created a real branch. If they have a Figma library, ask whether it is published, whether components have descriptions, and **what Figma seat they are on** (this decides which Figma MCP to recommend). If they mentioned engineers, ask whether there is a repo yet.

Two or three follow-ups maximum. Interview fatigue kills this before the scaffold gets built.

**Before building, play it back.** Summarize what you understood in five or six lines and ask if it is right. Corrections are cheap here and expensive later.

## Phase 2: Connections before files

Do this before the scaffold. Connections change what the files need to say: if Figma is connected, "ask me and I'll paste the hex" is a rule nobody has to write.

Read `references/connections.md` and recommend by job, not by catalogue. Two connections do most of the work for a designer: a Figma server, and a browser so Claude can check its own output. Everything else is conditional.

Keep the set small and deliberate. Overlapping servers create genuine ambiguity about which tool to reach for, and the designer pays for that on every task.

## Phase 3: Show the whole map, then triage it

Read `references/scaffold-map.md`. Show the **entire** scaffold, including the parts they should not build yet, with a status marker on every line:

```
●  have it     ◐  do now     ○  later (trigger)     ✕  not for you
```

Seeing the whole shape is a large part of the value, because most designers have never seen what a good setup looks like. Marking status is what stops it reading as a to-do list they owe someone. It is a map with their position on it.

Pre-fill the markers with a real recommendation for their situation rather than handing over a blank menu. Then let them move anything between buckets. Three moves, and they can say them in any words: **remove it**, **help me create it now**, **save it for later**.

Record every decision in `SETUP.md`, including the no's:

- Removed items go under `## Decided against` with the one-line reason, so a later session never re-suggests them.
- Deferred items go under `## Add later` **with a trigger** — what has to happen first. "Later" with no condition never arrives.

Then create only the slots marked *have it* and *do now*. Where something does not exist yet but is inert, create the file anyway with a clear note inside:

```markdown
> TODO: No token file yet. When your Figma variables are ready,
> export them here as tokens.json. Until then Claude will ask you
> for color and spacing values directly.
```

An empty labelled slot tells the designer what to build next. A missing file tells them nothing.

If there is no repo, run `git init` in the folder anyway. It costs nothing, it gives readable diffs on `tokens.json`, and the whole folder moves into the product repo later unchanged.

## Phase 4: Read what they already have

If a design system exists and a Figma server is connected, **go and look at it before drafting a single rule.** Read `references/reading-the-system.md`.

Come back with a short diagnosis — how many variables, how many have descriptions, whether the naming carries any meaning — and let the designer correct that. A finding they can react to is worth more than any question you could ask them.

This phase also improves the system itself: descriptions, semantic naming, DTCG-shaped structure. That work makes every later session cheaper, and it shortens the rules file, because a system that explains itself needs fewer rules written about it.

Skip this phase only if there is genuinely nothing to read.

## Phase 5: Fill the files, one at a time

Write `SETUP.md` first as the checklist, then work down it.

For each file:

1. Say what this file is for in one sentence, and what does not belong in it
2. Draft it — from the interview, and from what you found in Phase 4
3. Show the draft and ask what is wrong
4. Apply their edits, mark it done in `SETUP.md`
5. **Say what you are doing next, in one line**, then do it

Never draft more than one file at a time. Reviewing one short file is easy; reviewing six is a wall, and the designer will approve them all without reading.

Keep the steps small and always name the next one. "Done. Next: `CLAUDE.md`, which is where things live rather than how you decide" costs one line and removes all the uncertainty about how long this goes on for.

**Never end a turn on a question the designer cannot answer.** If a section needs something they do not have to hand, write the TODO with what it needs and why, say when you will come back to it, and keep moving. A blocked turn stops the setup; a labelled TODO does not.

Start with `.claude/rules/design-principles.md`, since it is the shortest and it is built almost entirely from question 7. An early win makes the rest feel possible.

At any point they can stop. When they return and say "continue setup," read `SETUP.md` and pick up at the first unchecked item.

If tokens are in scope, read `references/token-pipeline.md` before drafting anything about them. The format, the direction of sync, and where token meaning lives are all decisions worth getting right once.

## Phase 6: Give Claude a way to check its work

Do not end the setup at files. Claude stops when the work looks done, and without a check it can run, the designer is the one who catches every mistake.

Read `references/verification.md`. For a designer the check is a visual diff: build it, screenshot it, compare against the Figma frame, list the differences, fix. Set this up if there is anything buildable. If there is not, put it on the map as *later* with that as the trigger, and say plainly that until then the designer is the loop.

## Phase 7: Say what comes next

Close by reading `references/growing-your-setup.md` and leaving the triggers in `SETUP.md`. The scaffold is a starting position. What makes it compound is knowing that a repeated correction becomes a rule, a repeated explanation becomes a skill, and both get written from a real failure rather than from imagination.

## What goes where

The sorting rule behind every decision in this skill: **does this change when the design system grows?**

If no, it can live in an always-loaded file. Principles, conventions, product context.

If yes, it belongs somewhere fetched. Component lists, token values, screen specs, research, exemplars.

This is why the principles file holds how you decide and never what you have. When a designer asks where something goes, ask them whether adding twenty components would change it.

For the full mapping of content to files, read `references/what-goes-where.md`.

## Adapting to what they have

**No design system.** Skip the token rules entirely. Create `CLAUDE.md` and the principles rule only, plus a note in `SETUP.md` about what to add once a system exists.

**Figma only, no code.** The whole scaffold lives in a plain folder. Reference components by name and let Claude ask about values it does not have. If no Figma server is connected, that is the first thing to fix, not a file.

**No MCP connected.** Everything still works. Write into `CLAUDE.md` where things live in plain English, for example "our components are in the Figma file called Product Library, ask me and I'll paste what you need."

**Solo designer.** Skip owners, skip governance, skip anything about handoff. Those are real costs with no benefit for one person.

**Existing messy setup.** Read what is there first. Keep every real rule they have written, since that content is hard-won. Only move things between files and cut what is inventory. Show them what you are moving and why before touching anything.

## Quality check

Before saying the setup is done:

- Is `CLAUDE.md` under 200 lines, and each rules file under about 40?
- Would removing any given line cause Claude to make a mistake? If not, it should be gone.
- Does any always-loaded file contain a value, a component name, or a list that will grow?
- Does every rule trace back to something the designer actually said?
- Is there anything in `.claude/skills/` or `.claude/agents/` that is a stub rather than a real, working file?
- Is every TODO specific about what is needed and why?
- Does every deferred item have a trigger, and every removed item a reason?
- Does `SETUP.md` reflect the real state, so a return visit works?

## Never

Do not write a rule the designer did not give you, even a sensible one. They will assume it is their own rule six months later.

Do not paste design system contents into any file. That is the exact failure this structure prevents.

Do not create stub skills or agents. Those directories are live. Candidates go in a README as a list, and get written later from a real failure, not from an interview.

Do not create files for tools they do not use. An empty `.storybook` reference in a project with no Storybook is noise.

Do not use jargon in the interview or in the file notes. Write "the file Claude reads every time" rather than naming loading mechanics.

## Working with other skills

This skill sets the structure up. For auditing an existing design system's component names, use the component audit workflow. For writing the actual design system content, use the relevant design skills. This one is about where things live, not what they say.
