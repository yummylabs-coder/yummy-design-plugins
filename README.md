# Yummy Design — Claude Code plugins

Design tooling for Claude Code, built for designers rather than for engineers who happen to design.

---

## Install

> **These go in Claude's chat box, not a terminal.** Same place you'd type "help me with this screen." If you can send Claude a message, you can install this.

### Option 1 — Type two messages (easiest, works everywhere)

Open Claude Code and send:

```
/plugin marketplace add yummylabs-coder/yummy-design-plugins
```

Then:

```
/plugin install design-context@yummy-design
```

That's it. If Claude says *"Run /reload-plugins to activate"*, send that too.

### Option 2 — Click through the desktop app

In the Claude Code desktop app, click the **+** button next to the message box → **Plugins** → **Add plugin**. You'll get a browser showing what each plugin installs and what it costs you in context.

You'll still need to add the marketplace once using the first line from Option 1 — after that, everything is clicking, including updates.

### Option 3 — No typing at all

1. Click the green **Code** button at the top of this page → **Download ZIP**
2. Unzip it, and open `plugins/design-context/skills/`
3. In Finder, choose **Go → Go to Folder** and type `~/.claude/skills`
4. Drag the `design-context-setup` folder into it
5. Restart Claude Code

Works immediately. The trade-off: you won't get updates automatically — you'd re-download when this repo changes.

### Using it

Once installed, either ask Claude something like *"help me set up this project"*, or invoke it directly:

```
/design-context:design-context-setup
```

To update later:

```
/plugin marketplace update yummy-design
```

---

## What's in it

### `design-context`

Most designers know their product and their design rules perfectly well. What they don't know is which file each piece belongs in — and that uncertainty is enough to stop them setting anything up at all.

So Claude ends up guessing. It invents a hex that's *nearly* your green, rebuilds a component you already have, writes copy in a voice that isn't yours, and you correct the same three things every session.

This fixes the setup, not the prompt.

#### What it actually does

**It interviews you in plain language.** Seven questions, one at a time, no form. What are you building, where does your design system live, what's it being built in, and — the one that matters most — *what do you find yourself explaining to Claude over and over?* Whatever you repeat is by definition something that should be written down once.

**It sorts out connections before files.** Which MCP servers are actually worth having (two, mostly), and which Figma server given your seat — because the official one caps free and Collab seats at about six calls a month, and most designers hit that and conclude Figma MCP is broken.

**It shows you the whole scaffold as a map** — including the parts you shouldn't build yet — so you can see the shape before deciding anything.

**It reads your actual design system** instead of asking you to describe it from memory.

**It drafts the files with you, one at a time,** and never invents a rule you didn't give it.

**It sets up a way for Claude to check its own work,** so you stop being the one who catches every mistake.

---

## What it looks like

### The interview

```
Claude:  What are you working on? A couple of sentences is plenty.

You:     A plant care app. Reminders for watering, light needs,
         that kind of thing.

Claude:  Do you have a design system yet, or are you starting fresh?
         And if you've got one, where does it live?

You:     Yes, in Figma. It's local, not published.

Claude:  Last of the main ones, and it's the one that matters most:
         what do you find yourself explaining to Claude over and over?

You:     Mostly which token to use where. And that I want it to stay
         in the system but still push it if something doesn't exist.
```

### The map

Rather than a list of files you now owe someone, you get your position marked on the whole thing:

```
●  have it     ◐  do now     ○  later (trigger)     ✕  not for you

◐  Figma MCP connected          your system is in Figma; ends value-pasting
◐  A browser connected          the only way Claude can check its own work
◐  git init                     costs nothing, gives you token diffs

◐  CLAUDE.md                    what this is, where things live
◐  .claude/rules/               how you decide. Loads every session
○  using-tokens.md              when there's code to scope it to

◐  design/exemplars/            annotated examples of what good means
◐  design/assets/               real copy + imagery, so no placeholders
●  design/specs/                empty on purpose — one per screen
○  design/research/             after your first user interviews
✕  design/decisions/            two people; pure overhead

◐  tokens/tokens.json           you have variables — export them (DTCG)
○  .claude/skills/              when you've explained the same thing 3×
```

You move anything between buckets. Say *remove it*, *help me create it now*, or *save it for later*, and the decisions get written down — including the no's, so nothing gets re-suggested at you next month.

### Reading your system

If Figma's connected, it goes and looks before asking you anything:

```
47 colour variables across two collections. 12 have descriptions.
Naming is literal — green/600, green/700 — with no semantic layer,
so nothing in the file says which one is the action colour. That's
why colour gets applied inconsistently: there's no right answer to
find, only a nearest match.

Want me to propose descriptions for the 35 without them?
```

You're correcting a finding instead of writing an essay about your colour philosophy. And the fix improves the system itself — every description added is a question nobody has to answer again.

### What you end up with

Short files. This one loads every session, which is why it stays this size:

```markdown
# Design principles

How we decide here. What we *have* lives in Figma and in
tokens.json, not in this file.

## Always
- Use the values that exist. If one isn't in the system, say so —
  never approximate with a near match.

## When something doesn't exist yet
- Build it from existing tokens. Push the system, don't leave it.
- Say clearly that it's new, and why the existing pieces didn't cover it.

## Never
- Never quietly deviate. An unflagged deviation is how a system rots.

> TODO: voice — needs a real copy sample before this can be written.
```

That `TODO` is deliberate. You didn't describe your voice, so it didn't invent one — because you'd read invented rules back in six months and assume they were yours.

---

## The ideas behind it

**Context is finite, and performance degrades as it fills.** Everything here follows from that. Files that load every session stay short; everything else gets fetched only when relevant.

**How you decide vs. what you have.** Principles go in files that always load. Inventory — component lists, token values, screen specs — gets fetched. The test: *would this line still be true if you added twenty components tomorrow?*

**A rule is a fact, a skill is a procedure.** "Never use a raw hex" is a rule. "How we write an audio guide script" is a skill. Both should be written from a real failure, not from imagination.

**Show, don't ask.** Nobody can answer "what are your colour rules?" cold. You know it when you see it. So it goes and looks first.

**Every line has to earn its place.** The test for anything in an always-loaded file: *would removing this cause Claude to make a mistake?* If not, it's noise — and a bloated file means your actual rules get ignored.

---

## The seven phases

1. **Interview** — plain language, one question at a time
2. **Connections** — which MCP servers matter, and which Figma server for your seat
3. **The map** — the whole scaffold at once, with your position on it
4. **Read what you have** — diagnoses your real design system before drafting rules
5. **Draft the files** — one at a time, short, nothing invented
6. **Verification** — the loop that lets Claude check its work against your design
7. **What comes next** — triggers, so the setup grows from real failures

It works with no MCP connections, no codebase, and no design system.

---

## Developing

Test changes before pushing by adding the marketplace from a local path:

```
/plugin marketplace add ./yummy-design-plugins
/plugin install design-context@yummy-design
```

The skill lives at `plugins/design-context/skills/design-context-setup/`. Keep `SKILL.md` short and put detail in `references/` — a skill about avoiding context bloat shouldn't cause any.

Feedback and issues welcome.
