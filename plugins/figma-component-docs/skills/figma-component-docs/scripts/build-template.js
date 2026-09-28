// Builds the shared doc template, doc/_Template, inside a "_Doc Template" section on the
// current page. Run once per file through figma_execute (Figma Console MCP) or
// use_figma (official Figma MCP).
//
// The checker (verify.js) finds every part by LAYER NAME. Restyle freely afterwards
// (fonts, colors, text styles, variables) but keep the names.

const CANVAS_WIDTH = 992;   // 992, or 1400 for full-row components
const PANEL_WIDTH = 360;

const INK = { r: 0.08, g: 0.07, b: 0.06 };
const INK_2 = { r: 0.34, g: 0.33, b: 0.32 };
const LINE = { r: 0.90, g: 0.89, b: 0.87 };
const PANEL_BG = { r: 0.98, g: 0.975, b: 0.97 };
const SLOT_BG = { r: 0.965, g: 0.96, b: 0.95 };
const ACCENT = { r: 0.35, g: 0.31, b: 1 };

for (const style of ['Regular', 'Medium', 'Semi Bold', 'Bold']) {
  await figma.loadFontAsync({ family: 'Inter', style });
}

function frame(name, dir, opts = {}) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir;
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.itemSpacing = opts.gap ?? 0;
  const p = opts.pad ?? 0;
  f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = p;
  f.fills = opts.fill ? [{ type: 'SOLID', color: opts.fill }] : [];
  if (opts.radius) f.cornerRadius = opts.radius;
  return f;
}

function text(name, chars, size, style = 'Regular', color = INK) {
  const t = figma.createText();
  t.name = name;
  t.fontName = { family: 'Inter', style };
  t.fontSize = size;
  t.lineHeight = { value: Math.round(size * 1.45), unit: 'PIXELS' };
  t.fills = [{ type: 'SOLID', color }];
  t.characters = chars;
  return t;
}

// Append, then stretch across the parent. FILL only works once the node has a parent.
function add(parent, child, fill = true) {
  parent.appendChild(child);
  if (fill) {
    child.layoutSizingHorizontal = 'FILL';
    if (child.type === 'TEXT') child.textAutoResize = 'HEIGHT';
  }
  return child;
}

function slot(height = 160) {
  const s = figma.createFrame();
  s.name = 'specimen slot';
  s.resize(400, height);
  s.fills = [{ type: 'SOLID', color: SLOT_BG }];
  s.strokes = [{ type: 'SOLID', color: { r: 0.75, g: 0.74, b: 0.72 } }];
  s.dashPattern = [6, 6];
  s.cornerRadius = 8;
  return s;
}

function badge(name, n) {
  const b = frame(name, 'HORIZONTAL', { fill: ACCENT, radius: 8 });
  b.primaryAxisSizingMode = 'FIXED';
  b.counterAxisSizingMode = 'FIXED';
  b.resize(16, 16);
  b.primaryAxisAlignItems = 'CENTER';
  b.counterAxisAlignItems = 'CENTER';
  b.appendChild(text('n', String(n), 10, 'Bold', { r: 1, g: 1, b: 1 }));
  return b;
}

// ---------- the doc frame ----------
const doc = frame('doc/_Template', 'HORIZONTAL', { fill: { r: 1, g: 1, b: 1 }, radius: 16 });
doc.strokes = [{ type: 'SOLID', color: LINE }];
doc.clipsContent = true;

// ---------- left panel ----------
const panel = frame('panel', 'VERTICAL', { gap: 28, pad: 32, fill: PANEL_BG });
doc.appendChild(panel);
panel.counterAxisSizingMode = 'FIXED';
panel.resize(PANEL_WIDTH, 100);
panel.primaryAxisSizingMode = 'AUTO';
panel.layoutSizingVertical = 'FILL';

const head = add(panel, frame('head', 'VERTICAL', { gap: 10 }));
add(head, text('eyebrow', 'COMPONENT', 11, 'Semi Bold', INK_2));
add(head, text('title', 'Component name TBD', 24, 'Bold'));
const status = add(head, frame('status', 'HORIZONTAL', { pad: 0, fill: SLOT_BG, radius: 100 }), false);
status.paddingLeft = status.paddingRight = 10;
status.paddingTop = status.paddingBottom = 4;
status.appendChild(text('status label', 'In progress', 11, 'Medium', INK_2));
add(head, text('purpose', 'What it is, in one sentence. When to reach for it, in a second. TBD', 14, 'Regular', INK_2));

const usedIn = add(panel, frame('used in', 'VERTICAL', { gap: 6 }));
add(usedIn, text('label', 'USED IN', 11, 'Semi Bold', INK_2));
add(usedIn, text('value', 'Screens and parent components, by name. TBD', 14));

const specs = add(panel, frame('specs', 'VERTICAL', { gap: 12 }));
add(specs, text('label', 'SPECS', 11, 'Semi Bold', INK_2));
const specRows = add(specs, frame('rows', 'VERTICAL', { gap: 12 }));
for (let i = 0; i < 4; i++) {
  const r = add(specRows, frame('spec', 'VERTICAL', { gap: 2 }));
  add(r, text('count', '3 Sizes', 14, 'Semi Bold'));
  add(r, text('detail', 'MD, SM and XS. One sentence on when to use which. TBD', 13, 'Regular', INK_2));
}

// ---------- canvas ----------
const canvas = frame('canvas', 'VERTICAL', { gap: 56, pad: 24 });
doc.appendChild(canvas);
canvas.counterAxisSizingMode = 'FIXED';
canvas.resize(CANVAS_WIDTH, 100);
canvas.primaryAxisSizingMode = 'AUTO';
canvas.paddingTop = canvas.paddingBottom = 40;

function block(name, title) {
  const b = add(canvas, frame(name, 'VERTICAL', { gap: 20 }));
  const meta = add(b, frame('meta', 'VERTICAL', { gap: 6 }));
  add(meta, text('eyebrow', name.toUpperCase(), 11, 'Semi Bold', ACCENT));
  add(meta, text('title', title, 18, 'Bold'));
  add(meta, text('intro', 'One sentence on what this block shows. TBD', 14, 'Regular', INK_2));
  const body = add(b, frame('body', 'VERTICAL', { gap: 16 }));
  return body;
}

function specimenWithCaption(body) {
  add(body, slot());
  add(body, text('caption', 'Caption, eight words at most. TBD', 12, 'Regular', INK_2));
}

// Anatomy: a free-positioned specimen with badges on it, and a numbered key beside it
{
  const body = block('anatomy', 'Anatomy');
  body.layoutMode = 'HORIZONTAL';
  body.layoutSizingHorizontal = 'FILL'; // fixed primary axis, so FILL children fit
  body.itemSpacing = 32;
  const spec = figma.createFrame();
  spec.name = 'specimen';
  spec.fills = [];
  spec.resize(480, 200);
  body.appendChild(spec);
  const s = slot(200);
  s.resize(480, 200);
  spec.appendChild(s);
  const key = frame('key', 'VERTICAL', { gap: 12 });
  body.appendChild(key);
  key.layoutSizingHorizontal = 'FILL';
  for (let i = 1; i <= 3; i++) {
    const b = badge('badge ' + i, i);
    spec.appendChild(b);
    b.x = 2; b.y = 8 + (i - 1) * 60;
    const row = add(key, frame('callout ' + i, 'HORIZONTAL', { gap: 10 }));
    row.appendChild(badge('num', i));
    const t = text('text', 'Part name, and what it does. TBD', 13);
    row.appendChild(t);
    t.layoutSizingHorizontal = 'FILL';
    t.textAutoResize = 'HEIGHT';
  }
}

specimenWithCaption(block('matrix', 'Variants and states'));
specimenWithCaption(block('options', 'Options'));
specimenWithCaption(block('in use', 'In use'));

{
  const body = block('rules', 'Rules');
  body.itemSpacing = 10;
  for (let i = 1; i <= 3; i++) {
    const row = add(body, frame('rule', 'HORIZONTAL', { gap: 12 }));
    row.appendChild(text('n', String(i).padStart(2, '0'), 13, 'Semi Bold', ACCENT));
    const t = text('text', 'If this needs a second line, it is body copy, not a rule. TBD', 14);
    row.appendChild(t);
    t.layoutSizingHorizontal = 'FILL';
    t.textAutoResize = 'HEIGHT';
  }
}

{
  const body = block("don't", "Don't");
  body.layoutMode = 'HORIZONTAL';
  body.layoutSizingHorizontal = 'FILL';
  body.itemSpacing = 16;
  for (let i = 0; i < 2; i++) {
    const ex = frame('example', 'VERTICAL', { gap: 8 });
    body.appendChild(ex);
    ex.layoutSizingHorizontal = 'FILL';
    add(ex, slot(140));
    add(ex, text('caption', 'What goes wrong, eight words max. TBD', 12, 'Regular', INK_2));
  }
}

// ---------- the section ----------
const section = figma.createSection();
section.name = '_Doc Template';
const right = figma.currentPage.children
  .filter(n => n.id !== section.id && n.id !== doc.id)
  .reduce((m, n) => Math.max(m, n.x + n.width), 0);
section.x = right + 400;
section.y = 0;
section.appendChild(doc);
doc.x = 111;
doc.y = 114;
section.resizeWithoutConstraints(doc.width + 222, doc.height + 228);
if (doc.parent !== section) section.appendChild(doc);

figma.viewport.scrollAndZoomIntoView([section]);
return { section: section.id, template: doc.id, width: doc.width, height: doc.height };
