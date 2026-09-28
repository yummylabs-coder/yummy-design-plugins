# Yummy Design, Claude Code plugins

Design tooling for Claude Code, built for designers rather than for engineers who happen to design.

---

## Install

> **These go to Claude rather than to your computer.** You type them at Claude's own prompt, the same place you'd type "help me with this screen." That works identically whether you run Claude Code in a terminal or in the desktop app. If you'd rather run it from a shell, see option 3.

### Option 1: send two messages

The easiest route, and it works everywhere. Open Claude Code and send:

```
/plugin marketplace add yummylabs-coder/yummy-design-plugins
```

Then:

```
/plugin install design-context@yummy-design
```

For the Figma docs skill, send this one as well:

```
/plugin install figma-component-docs@yummy-design
```

That's it. If Claude says *"Run /reload-plugins to activate"*, send that too.

### Option 2: click through the desktop app

In the Claude Code desktop app, click the **+** button next to the message box, then **Plugins**, then **Add plugin**. You'll get a browser showing what each plugin installs and what it costs you in context.

You'll still need to add the marketplace once using the first line from option 1. After that, everything is clicking, including updates.

### Option 3: from a terminal, without opening Claude

If you live in the terminal, install it straight from your shell:

```bash
claude plugin marketplace add yummylabs-coder/yummy-design-plugins
claude plugin install design-context@yummy-design
claude plugin install figma-component-docs@yummy-design
```

This installs to user scope by default. Add `--scope project` to share it with everyone on a repo. It loads the next time you start Claude Code, or run `/reload-plugins` in a session that's already open.

### Option 4: no typing at all

1. Click the green **Code** button at the top of this page, then **Download ZIP**
2. Unzip it, and open `plugins/design-context/skills/`
3. In Finder, choose **Go**, then **Go to Folder**, and type `~/.claude/skills`
4. Drag the `design-context-setup` folder into it
5. Restart Claude Code

For the Figma docs skill, the folder is `plugins/figma-component-docs/skills/figma-component-docs`.

Works immediately. The trade-off is that you won't get updates automatically, so you'd re-download when this repo changes.

**Using Claude in the browser or the Claude app rather than Claude Code?** Zip the skill folder itself, the one with `SKILL.md` directly inside it, and upload that zip as a skill. Zipping anything higher up the tree won't upload.

### Using it

Once installed, either ask Claude to help you set up the project, or invoke it directly:

```
/design-context:design-context-setup
/figma-component-docs:figma-component-docs
```

To update later:

```
/plugin marketplace update yummy-design
```

---

## What's in it

- **`design-context`** sets your project up so Claude can be a real design partner. It's described below.
- **`figma-component-docs`** documents your design system components in Figma so people and AI agents can both build from them. [Jump to it](#figma-component-docs).

### `design-context`

Most designers know their product and their design rules perfectly well. What they don't know is which file each piece belongs in, and that uncertainty is enough to stop them setting anything up at all.

So Claude guesses. It invents a hex that's *nearly* your green, rebuilds a component you already have, and writes copy in a voice that isn't yours. Then it hands you `placeholder.jpg` and lorem ipsum while the real thing sits two folders away.

This fixes the setup rather than the prompt.

#### What it does

**It interviews you in plain language.** Seven questions, one at a time, with no form to fill in. What are you building, where does your design system live, what's it being built in, and the one that matters most: what do you find yourself explaining to Claude over and over? Whatever you repeat is by definition something that should be written down once.

**It sorts out connections before files.** Which MCP servers are worth having, which is usually two, and which Figma server suits your seat. The official one caps free and Collab seats at about six calls a month, so most designers hit that wall and conclude Figma MCP is broken.

**It shows you the whole scaffold as a map,** including the parts you shouldn't build yet, so you can see the shape before deciding anything.

**It reads your real design system** rather than asking you to describe it from memory.

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

You get your position on the whole thing rather than a list of files you now owe someone:

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
●  design/specs/                empty on purpose, one per screen
○  design/research/             after your first user interviews
✕  design/decisions/            two people; pure overhead

◐  tokens/tokens.json           you have variables, so export them (DTCG)
○  .claude/skills/              when you've explained the same thing 3×
```

You move anything between buckets by saying *remove it*, *help me create it now*, or *save it for later*. The decisions get written down, including the no's, so nothing gets re-suggested at you next month. Anything deferred gets a trigger attached, because "later" with no condition never arrives.

### Reading your system

If Figma is connected, it goes and looks before asking you anything:

```
47 color variables across two collections. 12 have descriptions.
Naming is literal, green/600 and green/700, with no semantic layer,
so nothing in the file says which one is the action color. That's
why color gets applied inconsistently: there's no right answer to
find, only a nearest match.

Want me to propose descriptions for the 35 without them?
```

You're correcting a finding, which is far easier than composing your color rules from nothing. The fix also improves the system itself, because every description you add is a question nobody has to answer again.

### What you end up with

Short files. This one loads every session, which is why it stays this size:

```markdown
# Design principles

How we decide here. What we *have* lives in Figma and in
tokens.json, not in this file.

## Always
- Use the values that exist. If one isn't in the system, say so,
  and never approximate with a near match.

## When something doesn't exist yet
- Build it from existing tokens. Push the system, don't leave it.
- Say clearly that it's new, and why the existing pieces didn't cover it.

## Never
- Never deviate without flagging it. That's how a system rots.

> TODO: voice. Needs a real copy sample before this can be written.
```

That `TODO` is deliberate. You hadn't described your voice, so it didn't invent one. Invented rules are the worst outcome here, because you read them back in six months and assume they were yours.

---

## The ideas behind it

**Context is finite, and quality degrades as it fills.** Everything here follows from that. Files that load every session stay short, and everything else gets fetched only when it's relevant.

**How you decide versus what you have.** Principles go in files that always load, while inventory like component lists, token values and screen specs gets fetched. The test is whether a line would still be true if you added twenty components tomorrow.

**A rule states a fact, whereas a skill describes a procedure.** "Never use a raw hex" is a rule, and "how we write an audio guide script" is a skill. Both should come from a real failure rather than from imagination.

**Look before you ask.** Nobody can answer "what are your color rules?" cold, because you know it when you see it. So it goes and reads the system first.

**Every line earns its place.** The test for anything in an always-loaded file is whether removing it would cause Claude to make a mistake, and a bloated file means your real rules get ignored anyway.

---

## The seven phases

1. **Interview**, in plain language, one question at a time
2. **Connections**, meaning which MCP servers matter and which Figma server suits your seat
3. **The map**, showing the whole scaffold at once with your position on it
4. **Read what you have**, diagnosing your real design system before drafting rules
5. **Draft the files**, one at a time, short, with nothing invented
6. **Verification**, the loop that lets Claude check its work against your design
7. **What comes next**, meaning triggers, so the setup grows from real failures

It works with no MCP connections, no codebase, and no design system.

---

## `figma-component-docs`

Component docs have three readers: a developer's AI agent reading the component description, a person skimming the canvas, and anyone who needs the history. This skill gives each one its own home, builds every doc frame from one shared template, and runs a checker inside Figma that measures each frame against text limits and flags missing interaction behavior and unused component properties.

#### What you need

A Figma MCP that can run plugin code: [Figma Console MCP](https://github.com/southleft/figma-console-mcp) (`figma_execute`) or the official Figma MCP (`use_figma`).

#### How to use it

1. Open your design system file and ask Claude to "set up the doc template". It builds the template, then runs the checker on it. The empty template should fail; that's how you know the checker works.
2. Restyle the template with your own fonts, colors and variables. Keep the layer names, since the checker finds everything by name.
3. For each component: "document the Button component".

#### What's inside

```
figma-component-docs/
├── SKILL.md                    # the procedure and the traps
├── references/doc-template.md  # the format, the limits, the interaction contract
└── scripts/
    ├── build-template.js       # builds doc/_Template in your file (run once)
    └── verify.js               # checks a doc frame and its component
```

---

## Developing

Test changes before pushing by adding the marketplace from a local path:

```
/plugin marketplace add ./yummy-design-plugins
/plugin install design-context@yummy-design
```

Each plugin's skill lives under `plugins/<plugin>/skills/`. Keep `SKILL.md` short and put detail in `references/`, since a skill about avoiding context bloat shouldn't cause any.

Feedback and issues welcome.

## License

MIT. Made by Carmen Rincon at Yummy Labs.
