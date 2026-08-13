# Verification

Claude stops when the work looks done. Without a check it can run, "looks done" is the only signal available, and the designer becomes the verification loop: every mistake waits for them to notice it.

This is the single highest-value thing to set up, and most design setups skip it entirely.

## Contents

- The design-native check
- Writing specs that can be checked
- Escalating how hard the check gates
- The fresh-eyes critic
- When there is no code yet

## The design-native check

For engineers the check is a test suite. For a designer it is a visual diff:

1. Build the thing
2. Screenshot it in the browser
3. Compare against the Figma frame
4. List the differences
5. Fix and repeat

That loop closes on its own. Claude does the work, runs the check, reads the result, and iterates without the designer in the middle.

The prompt shape that starts it:

```
Implement the tour player from [Figma node]. Then take a screenshot of
the result, compare it against the design, list every difference, and
fix them. Show me the screenshot and the list.
```

What to compare against, in order of strength: the Figma frame via MCP, then an entry in `design/exemplars/`, then the acceptance lines in the spec. All three beat asking "does this look right?"

Have Claude show evidence rather than assert success — the screenshot, the command it ran, what it returned. Reviewing evidence is faster than re-running the check.

## Writing specs that can be checked

A spec in `design/specs/` should end with **how I will know it is right**. Three or four concrete lines:

```markdown
## Done when
- Play button is 64pt and centered on the transport row
- Stop title truncates to one line, never wraps
- Offline state shows the cached badge, not a spinner
- Matches the Figma frame at 390pt width
```

Those lines are the criteria Claude checks against. A spec without them is a description; a spec with them is a test.

## Escalating how hard the check gates

Each step trades setup effort for attention:

| How | What it does |
|---|---|
| In the prompt | ask Claude to run the check and iterate in the same message. Works today, no setup |
| A `/goal` condition | re-checked after every turn; Claude keeps working until it holds |
| A Stop hook | runs the check as a script and blocks the turn from ending until it passes |
| A second opinion | a subagent in a fresh context tries to find what the first one missed |

Start at the top. Most designers never need more than the first row, and it already changes the working relationship.

## The fresh-eyes critic

A session that just designed something is biased toward defending it. A subagent reviewing in a clean context is not.

Two gotchas worth writing into the agent file itself:

- **It does not inherit the conversation or auto memory.** Point it explicitly at the spec, the principles rule, and the relevant exemplars, or it invents its own criteria and reviews against those.
- **A reviewer asked to find problems will always find some.** Scope it: flag only what breaks a stated requirement or a principle. Everything else is optional. Otherwise it generates busywork that reads like rigour.

## When there is no code yet

The loop still works, it is just weaker. Options in order:

- Have Claude build a static HTML mockup and screenshot that. Crude, but it produces a real artifact to compare against a frame.
- Check the output against the spec's `## Done when` lines in prose. Weaker, because Claude is grading its own description rather than a rendered result. Say so honestly rather than pretending it is equivalent.

Mark verification as *later* on the map with a clear trigger: **the first time there is something buildable to look at.** Do not let it sit unmarked, or it never arrives.
