# Connections

Do this before building the scaffold. What Claude can see changes what the files need to say.

Recommend by job. Never hand over a catalogue — a designer who connects everything available has built a slower, more ambiguous setup, not a stronger one.

## Contents

- The two that matter
- Which Figma server
- Conditional connections
- Hygiene rules
- Writing `.mcp.json`

## The two that matter

**A Figma server.** Turns "paste me the hex" into Claude reading variables, components and screenshots directly. Without it, every token rule the designer writes is aspirational.

**A browser.** This is the verification loop. Screenshot the built thing, compare it to the Figma frame, list differences, fix them. Anthropic's most emphasised practice is giving Claude a check it can run; for a designer, a visual diff *is* that check. Without a browser there is no check, and the designer stays the bottleneck on every mistake.

Everything else is conditional.

## Which Figma server

Ask one question: **do you have a Dev or Full seat on a paid Figma plan?**

| Their situation | Recommend |
|---|---|
| Starter plan, or a View/Collab seat | **Console.** The native remote server allows roughly 6 tool calls per month at that tier, which is a demo, not a workflow |
| Dev/Full seat, reading designs into code only | **Native.** Official, supported, selection-based, needs the desktop app with Dev Mode |
| Round-tripping tokens, or writing back to Figma | **Console**, at any tier |

Why Console goes further: it works through the Plugin API via a bridge plugin rather than Dev Mode, so it is not seat-gated. It does bidirectional token sync (export and import, DTCG dialects, dry-run previews) and can import library variables without Enterprise access.

Two caveats to state out loud rather than bury:

- It is third-party, and it executes Plugin API code against the designer's real file. Work on a duplicate until they trust it.
- It ships a very large tool set. Tool schemas load on demand in current Claude Code, so this is much cheaper than it used to be, but running Console *and* native together creates real ambiguity about which tool to reach for. Pick one as primary.

## Conditional connections

| What they are trying to do | Connect |
|---|---|
| Content that changes without a redesign | Notion, or a real CMS |
| Specs and tickets that already live elsewhere | Linear or Notion — only if they genuinely work there |
| Anything involving a repo | the `gh` CLI, not an MCP server |

**On the CMS question.** Frame it as a design decision, not an integration. Ask: *does any content in this product change without a redesign?* If yes, model it now. The moment a designer models real content, they stop designing screens around fake data and start designing around the real shape. Notion is the cheapest way for a designer to do that without waiting on an engineer.

**On repos.** CLI tools are the most context-efficient way to reach an external service, and Claude already knows how to drive `gh`. Recommend it over a GitHub MCP server.

## Hygiene rules

- **Two or three servers, chosen deliberately.** If a human cannot say which tool a job needs, Claude cannot either.
- **Prune anything unused for a week.** Connections are not free and they never announce themselves as the problem.
- **Never run two servers that do the same job** unless the designer knows which one is primary.

## Writing `.mcp.json`

Put the project's servers in a `.mcp.json` at the project root. Project-scoped servers load for this project only and travel with the folder, instead of every designer accumulating a dozen global servers that follow them into every session.

```json
{
  "mcpServers": {
    "example": {
      "type": "http",
      "url": "https://example.com/mcp"
    }
  }
}
```

Add servers with `claude mcp add --scope project`, and check the file into git so it moves with the work.
