---
name: figma-component-docs
description: Documents design system components in Figma so people and AI agents can both build from them. Builds each component's doc frame from one shared template, writes the component description that dev agents read, and runs a checker inside Figma that measures the frame against text limits and flags missing interaction behavior and unused properties. Use when documenting a component or pattern, building or editing a doc frame, writing a component description for developers, or when the user says "document this component", "write the docs for", "add a doc frame", "set up the doc template", "is this documented properly", or asks why one doc frame looks different from the others. Requires a Figma MCP that can run plugin code (Figma Console MCP figma_execute, or the official Figma MCP use_figma). Do NOT use for creating tokens or building the component itself.
metadata:
  author: Carmen Rincon
  version: 1.0.1
---

# Documenting a component in Figma

The format lives in `references/doc-template.md`. **Read it first.** It holds the block
order, the text limits, which blocks each component type gets, and the interaction
contract. This file is the procedure and the traps. It deliberately does not repeat the
limits, because two copies drift.

## Three readers, one home each

Most component docs fail because one artifact is trying to serve three readers. Split
them and each one gets better.

- **The component description field** is read by developers and their AI coding agents
  (Claude Code, Cursor, anything reading the file through an MCP). It decides how the
  component gets built and used, so it is dense and directive and can be long. When the
  description and the canvas disagree, the description wins, because it is the half that
  ships.
- **The doc frame on the canvas** is read by a person skimming. Short captions, real
  component instances carrying the meaning, and hard limits on how much text goes where.
- **A decisions log** (a markdown file in the repo, a Notion page, anything outside the
  canvas) holds history: what changed, when, and why. History never goes on the canvas.

Write the description *and* the frame. They are different artifacts and neither
substitutes for the other.

## Running code in Figma

Every script in `scripts/` is plugin code, not a Node script. Run it through whichever
Figma MCP is connected:

- **Figma Console MCP**: `figma_execute`, with the Desktop Bridge plugin running.
- **Official Figma MCP**: `use_figma`. Load its `figma-use` skill first if it has one.

Read the script, replace the placeholder constants at the top, and pass the whole file
as the code. Both scripts `return` a result object.

## First time in a file: build the template

If the file has no `doc/_Template` frame, build it once:

1. Ask the user which page holds components. Navigate there.
2. Run `scripts/build-template.js`. It creates a `_Doc Template` section holding
   `doc/_Template`, with every block, placeholder text and dashed specimen slot.
3. Run `scripts/verify.js` against the new template (see "The checker"). **It must fail**,
   with a violation for every placeholder. If the template ever comes back clean, the
   checker is broken, so stop and fix that before documenting anything.
4. Tell the user they can restyle the template (fonts, colors, their own text styles and
   variables) as long as they keep the **layer names**. The checker finds everything by
   name, so renaming a layer breaks it silently.

## Procedure for each component

1. **Read `references/doc-template.md`.** Pick the blocks from the component's type. A
   control (button, input, toggle) gets the matrix and usually skips anatomy. A pattern
   (card, row, panel) is the reverse.
2. **Give the component its own section**, named the way people say it: `Data Card`,
   not `Data_Card`. If the file's sections use a background fill, bind it to the same
   variable the others use rather than leaving Figma's default white.
3. **Clone `doc/_Template`.** Never build a doc frame from scratch, and never copy another
   component's doc frame, because you inherit its overrides and its specimens.
4. **Rename the clone `doc/<Component>`, put it at the top of the section, and move the
   component itself to the bottom of the same section**, under its documentation. A
   component living on a playground page or in a neighboring frame is the thing this
   step exists to stop.
5. **Fill the left panel**, then the canvas. Delete the blocks that do not apply rather
   than leaving them empty.
6. **Use real instances as specimens.** Clone the component's instances, or rows from an
   older doc frame. Never redraw a specimen, and never rescale one: scaling an instance
   leaves token-bound values (padding, radius, type) at full size.
7. **Override default content with real content.** A component that ships with
   `Label`, `Attribute 1` or `Lorem ipsum` reads as an abstract diagram. Use content from
   a real screen.
8. **Read the Rules block against the description, line by line.** Anything true only on
   the canvas goes into the description first. A rule that lives only on the canvas is one
   the dev agent never sees, and it will build the opposite and report the doc as
   inconsistent. Do this by reading, not with a word-overlap check, which passes missing
   rules and flags present ones.
9. **Write the INTERACTION block if the component is interactive.** The labels and the
   reason for each are in `references/doc-template.md`, "The interaction contract".
   Answer every one, with "none" where it does not apply. Then delete any component
   property that no layer uses.

   Work through it the way a person uses the component, one move at a time: they click
   it, click away, press Escape, tab to it, it fails, the network is slow. At each move,
   ask what the description says happens. Wherever it says nothing, the developer will
   decide for you. Answer it here, or take it to the design lead if it is a judgment call.
   A behavior drawn nowhere and described nowhere (how a panel collapses, what a row
   does while it saves) is the one most likely to ship wrong.
10. **Screenshot it and look at it.** The checker cannot see that a specimen is the wrong
    one.
11. **Run the checker** and fix what it finds.

## The checker

`scripts/verify.js`. Replace `__DOC_ID__` with the doc frame's node id and run it
through the Figma MCP.

It returns a verdict and a list of findings. It checks:

- the section the frame lives in, and that the component sits under the frame
- canvas width, block order, and at most one extra block, placed between Options and In use
- sentence limits on the purpose and the block intros, the spec row count
- caption word counts, rules that wrap or run past eight
- long paragraphs loose on the canvas (prose belongs in the left panel)
- specimens wider than the column, which Figma clips with no warning
- anatomy badges against the numbered key
- leftover template placeholders and empty specimen slots

It also reads the **component** under the frame, because the description is what gets
built. If the component looks interactive (a Hover, Focus, Open, Pressed, Active,
Selected, Expanded or Editing variant, or a description that says opens, closes, expands,
collapses, dismisses, click, tap or drag), the description needs an `INTERACTION` block
with every label. And every
non-variant property has to be used by some layer.

It hands back the Rules block text as `rulesToDiff` so you can do step 8 by reading.

**What it cannot see**: whether the writing is good, whether a property is missing,
whether the specimen makes the point, whether a caption is accurate. It measures. You
still have to look.

## Check the pointer goes both ways

A component placed inside another one does not need the host re-documented. It needs
the host's description to name it as something the slot accepts, plus anything this
usage does differently. For every parent named in a frame's **Used in** block, open that
parent's description and check it names the child back. A host whose description says
"the table body holds GroupRows" while the screen shows a different row is a
contradiction the dev agent will hit.

## Not every internal component needs its own frame

Ask what the reader has to decide. An internal component with four types where picking
the right one is the whole judgment earns a frame with the four side by side. One with
Default, Hover and Expanded states (states nobody chooses) becomes one extra block
inside its parent's doc frame instead.

Internal components take a leading underscore, like `_Base_Card`. Their description
still does the governing. Only the doc frame is optional, never the description.

## Options is a diagram, not a catalog

A component with many booleans must not become one specimen per boolean. Ten toggles
shown on and off is eighteen specimens and a wall nobody reads. Show one annotated
specimen with every optional part on, plus one with them all off. Use the badge-and-key
device from Anatomy and group the switches onto at most six numbered parts; one key line
can name several switches. The canvas answers "what can come off". The description
carries the property names and what each one does.

## Anatomy numbers have to point at something

A numbered key beside a bare specimen is a list, not an anatomy. Build the specimen as a
frame named `specimen` with `layoutMode: 'NONE'` holding the instance, plus one 16px
`badge N` per callout, positioned on the part it names. Clone the badge from the template
rather than drawing one.

If the component has internal padding, sit badges on it at `x: 2`. If it has none, give
the `specimen` frame a 24px gutter each side, put the instance at `x: 24`, and hang the
badges in the gutter so one never covers a label. Point a badge at the *start* of a tall
region, not its middle.

## Traps

- **A doc frame clips.** A specimen wider than the canvas column loses its right-hand end
  silently. The checker catches this; the eye often does not.
- **`resize()` on an auto-layout frame kills hug sizing.** Set
  `primaryAxisSizingMode = 'AUTO'` afterwards or the frame collapses to the height you
  passed.
- **New text nodes default to Inter** until a style is applied. Load Inter Regular along
  with the file's own fonts before setting `characters`.
- **`mainComponent` can be async-only** (`getMainComponentAsync`) depending on the file's
  access mode, and `findAll` callbacks cannot await. Match on an instance's `name`.
- **Sections adopt and release children by position.** Moving a frame inside a section can
  drop it onto the page with no error. After moving anything, check `node.parent` is still
  the section and re-append it if not.
- **Template slots are fixed height.** A 500px specimen dropped into a 160px
  `specimen slot` overflows while the block stays template height. After filling, walk
  `specimen slot`, `row`, `key` and `example` setting `layoutSizingVertical = 'HUG'`,
  then the body, the block, and the canvas.
- **Cloning a filled block reuses its specimens.** Clearing only the text leaves the old
  instance in place and stacks the new one under it. Clear every child.
- **`layoutSizingHorizontal = 'FILL'` needs a fixed primary axis on the parent.** Switch
  a hugging body to horizontal and both children stay full width, so the second lands
  outside the frame and gets clipped.

## Never

Mark a component "Ready for dev", or tell a developer it is ready. Build it, document it,
show it, then ask. Readiness is the design lead's call.
