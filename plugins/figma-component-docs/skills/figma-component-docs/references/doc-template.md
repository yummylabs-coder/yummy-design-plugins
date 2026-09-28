# The doc template

One format for every component, so a reader who has seen one doc frame can read them
all. `scripts/verify.js` measures everything in this file that can be measured. If you
change a number here, change it in the checker too.

## Where things live

Every component gets a Figma **section** named for the component in plain words
(`Data Card`). Inside it, top to bottom:

1. `doc/<Component>`, the doc frame
2. the component or component set itself, underneath its documentation

## The doc frame

Two columns: a left **panel** for prose, and a right **canvas** for specimens. Prose lives
in the panel. The canvas shows.

### Left panel

| Part | Limit |
|---|---|
| **Purpose** | 2 sentences. What it is, then when to reach for it. |
| **Status** | In progress, In review, or Ready for dev. Only the design lead sets Ready for dev. |
| **Used in** | Every place the component appears: screens, and parent components by name. |
| **Specs** | 4 to 8 rows. Each starts with a count ("3 sizes", "2 tones", "4 states"), followed by one sentence, two at a push. |

### Canvas

Width is **992**, or **1400** for a component that spans a full row. Blocks pad 24 each
side, so the content column is the width minus 48. Nothing inside may be wider.

Blocks, always in this order. Delete the ones that do not apply; never leave one empty.

| Block | What it answers | Gets it |
|---|---|---|
| **Anatomy** | What are the parts called? | Patterns. Usually not simple controls. |
| **Matrix** | What does every variant and state look like? | Controls. Patterns only if they have states. |
| **Options** | What can come off? | Anything with boolean properties. |
| *one extra block* | Whatever this component needs that the others do not (a sub-component's states, a motion sequence). One at most, between Options and In use. | Optional |
| **In use** | What does it look like on a real screen? | Everything. |
| **Rules** | What must always or never happen? | Everything. |
| **Don't** | What mistakes does it invite? | When there are real ones. |

Every block has a **meta** (eyebrow, title, intro) and a **body**.

| Text | Limit |
|---|---|
| Block intro | 1 sentence, 2 at a push. The rest is a rule. |
| Caption | 8 words. Longer means it is a rule and belongs in Rules. |
| Rules | 8 at most, one line each. |
| Loose paragraphs on the canvas | None over 140 characters. Prose goes in the panel. |

**Anatomy**: numbered badges sit on the specimen itself, one per line in the key. A key
beside a bare specimen is a list.

**Options**: one annotated specimen with every optional part on, one with all off. Never
one specimen per boolean.

## The component description

This is what developers and their AI agents read, and it governs. Dense and directive is
correct here. Suggested shape, with headings in capitals on their own line:

```
One or two sentences: what it is and when to use it.

USE WHEN
· ...
DON'T USE
· ... (and what to use instead)

PROPERTIES
· Size: sm | md | lg. md is the default.
· Show icon: leading icon, off by default.

RULES
· Every rule from the canvas Rules block, word for word or stronger.

INTERACTION
· Opens: ...
· Closes: ...
· Running work: ...
· States: ...
· Focus: ...
· Repeated controls: ...
· Replaces: ...
```

A component with no interaction (a static badge, a divider) skips the INTERACTION
block. The checker decides a component is interactive if it has a variant value like
Hover, Focus, Open, Pressed, Active, Selected, Expanded or Editing, or if its description says
opens, closes, expands, collapses, dismisses, click, tap or drag.

## The interaction contract

Seven labels, every one answered. Write "none" where one does not apply: a missing line
and a considered "none" look identical to the person building it, so they will guess.

| Label | What to answer | Why it's here |
|---|---|---|
| **Opens** | What triggers it: click, hover, focus, keyboard shortcut, a parent action. | Hover-open and click-open are different components to a developer. |
| **Closes** | Every way out: click outside, Escape, a close button, choosing an option, route change. | The one people forget, and the one users feel. |
| **Running work** | What it shows while something is loading, saving or failing, and whether it can be cancelled. | Undrawn loading and error states get invented at build time. |
| **States** | Which variants are real states the user sees, and what moves between them. | Separates states the code manages from options a designer picks. |
| **Focus** | Where focus goes on open, where it returns on close, tab order inside. | Accessibility, and the first thing an agent gets wrong. |
| **Repeated controls** | What happens when there are many on one screen: does opening one close the others, do they share state? | A list of twenty rows each opening its own menu is a different build from one. |
| **Replaces** | Anything this component replaces or must not be used alongside. | Stops the old pattern and the new one shipping side by side. |

## Properties

Every non-variant property must be used by at least one layer. A property nothing
references still shows in the properties panel, reads as a feature, and gets built.
Delete it.
