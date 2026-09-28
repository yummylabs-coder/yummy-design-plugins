// Doc frame checker. Run through figma_execute (Figma Console MCP) or use_figma
// (official Figma MCP), with __DOC_ID__ replaced by the node id of the doc/<Name> frame.
//
// Measures a doc frame against references/doc-template.md. Everything is found by
// layer name, so it works on any restyle of the template as long as names are kept.
// It checks what can be measured. It cannot tell you the writing is any good.

const DOC_ID = '__DOC_ID__';
const CANVAS_WIDTHS = [992, 1400];
const LIMITS = {
  purposeSentences: 2,
  specRowsMin: 4,
  specRowsMax: 8,
  specSentences: 2,
  introSentences: 2,
  captionWords: 8,
  rules: 8,
  looseParagraphChars: 140,
};
const CANON = ['anatomy', 'matrix', 'options', 'in use', 'rules', "don't"];
const INTERACTION_LABELS = ['Opens', 'Closes', 'Running work', 'States', 'Focus', 'Repeated controls', 'Replaces'];

const doc = await figma.getNodeByIdAsync(DOC_ID);
const out = [];
const flag = (level, where, msg) => out.push({ level, where, msg });

if (!doc) return { error: 'No node with id ' + DOC_ID };
if (!/^doc\//.test(doc.name)) flag('warn', doc.name, 'Frame is not named doc/<Component>.');

const child = (n, name) => (n && n.children ? n.children.find(c => c.name === name) : null);
const panel = child(doc, 'panel');
const canvas = child(doc, 'canvas');
if (!panel || !canvas) return { error: 'Not a doc frame: needs children named "panel" and "canvas".' };

const hasInstanceAncestor = n => { let p = n.parent; while (p && p.id !== doc.id) { if (p.type === 'INSTANCE') return true; p = p.parent; } return false; };
const texts = n => (n && n.findAll ? n.findAll(x => x.type === 'TEXT' && !hasInstanceAncestor(x)) : []);
const named = (n, name) => (n && n.findOne ? n.findOne(x => x.name === name && !hasInstanceAncestor(x)) : null);
// "e.g." and friends are not sentence ends
const sentences = s => s.replace(/\b(e\.g|i\.e|etc|vs)\./gi, '$1').split(/[.!?](?:\s|$)/).filter(x => x.trim().length > 1).length;
// separators and marks are punctuation, not words: "All on \u00b7 the basis" is 4
const words = s => s.replace(/[\u00b7\u2022\u2014\u2013\u2715\u2713]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
const lineHeightOf = t => (t.lineHeight && t.lineHeight.unit === 'PIXELS' ? t.lineHeight.value : (typeof t.fontSize === 'number' ? t.fontSize * 1.4 : 20));

// ---------- the section it lives in ----------
const sec = doc.parent;
if (!sec || sec.type !== 'SECTION') {
  flag('error', doc.name, "Not inside a section. A component's documentation is a section, not a loose frame.");
} else if (doc.name !== 'doc/_Template') {
  // "Data_Card" and "Data Card" both count: compare on letters and digits alone
  const key = x => x.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
  const expected = doc.name.replace(/^doc\//, '');
  if (key(sec.name) !== key(expected))
    flag('warn', 'section', 'Section is "' + sec.name + '", doc frame is "' + doc.name + '". Name the section for the component.');
  const comp = sec.children.find(c => c.type === 'COMPONENT' || c.type === 'COMPONENT_SET');
  if (!comp) flag('error', 'section', 'No component in the section. The component belongs at the bottom, under its documentation.');
  else if (comp.y < doc.y) flag('warn', 'section', 'The component sits above the doc frame. Documentation first, component below it.');
}

// ---------- leftover placeholders, anywhere ----------
for (const t of texts(doc)) {
  if (/\bTBD\b|Lorem ipsum/i.test(t.characters))
    flag('error', 'placeholder', '"' + t.name + '" still holds template text: "' + t.characters.slice(0, 50) + '"');
}
const slots = doc.findAll(x => x.name === 'specimen slot');
if (slots.length) flag('error', 'canvas', slots.length + ' dashed specimen slot(s) never replaced with a real instance.');

// ---------- canvas width ----------
const W = Math.round(canvas.width);
if (!CANVAS_WIDTHS.includes(W)) flag('error', 'canvas', 'Canvas is ' + W + ' wide. Allowed widths: ' + CANVAS_WIDTHS.join(' or ') + '.');
const CONTENT = W - canvas.paddingLeft - canvas.paddingRight;

// ---------- left panel ----------
const purpose = named(panel, 'purpose');
if (!purpose) flag('warn', 'panel', 'No "purpose" text.');
else {
  const n = sentences(purpose.characters);
  if (n > LIMITS.purposeSentences) flag('error', 'panel \u00b7 purpose', n + ' sentences. Limit is ' + LIMITS.purposeSentences + '.');
}
const status = named(panel, 'status');
const statusText = status ? texts(status)[0] : null;
if (statusText && /ready for dev/i.test(statusText.characters))
  flag('note', 'panel \u00b7 status', 'Reads "Ready for dev". Only the design lead sets that.');
if (!named(panel, 'used in')) flag('warn', 'panel', 'No "used in" block. Say everywhere the component appears.');

const specRows = panel.findAll(x => x.name === 'spec' && !hasInstanceAncestor(x));
if (specRows.length < LIMITS.specRowsMin || specRows.length > LIMITS.specRowsMax)
  flag('error', 'panel \u00b7 specs', specRows.length + ' spec rows. Limit is ' + LIMITS.specRowsMin + ' to ' + LIMITS.specRowsMax + '.');
specRows.forEach((r, i) => {
  const count = named(r, 'count'), detail = named(r, 'detail');
  if (count && !/^\d/.test(count.characters.trim())) flag('warn', 'panel \u00b7 spec ' + (i + 1), '"' + count.characters + '" does not start with a count.');
  if (detail && sentences(detail.characters) > LIMITS.specSentences) flag('warn', 'panel \u00b7 spec ' + (i + 1), 'One sentence, two at a push.');
});

// ---------- block order ----------
const blocks = canvas.children.filter(c => c.type === 'FRAME');
const known = [], extras = [];
blocks.forEach((b, i) => (CANON.includes(b.name) ? known : extras).push({ name: b.name, i }));
let last = -1;
for (const k of known) {
  const at = CANON.indexOf(k.name);
  if (at < last) flag('error', 'canvas', '"' + k.name + '" is out of order. Order: ' + CANON.join(', ') + '.');
  last = Math.max(last, at);
}
if (extras.length > 1) flag('error', 'canvas', extras.length + ' extra blocks (' + extras.map(e => e.name).join(', ') + '). One is allowed.');
const optAt = blocks.findIndex(b => b.name === 'options');
const useAt = blocks.findIndex(b => b.name === 'in use');
for (const e of extras) {
  if (optAt > -1 && e.i < optAt) flag('warn', 'canvas \u00b7 ' + e.name, 'An extra block goes after Options.');
  if (useAt > -1 && e.i > useAt) flag('warn', 'canvas \u00b7 ' + e.name, 'An extra block goes before In use.');
}

// ---------- per block ----------
for (const b of blocks) {
  const where = 'canvas \u00b7 ' + b.name;
  const meta = child(b, 'meta'), body = child(b, 'body');
  if (!meta || !body) { flag('warn', where, 'Block needs children named "meta" and "body".'); continue; }

  const intro = child(meta, 'intro');
  if (intro && intro.type === 'TEXT') {
    const n = sentences(intro.characters);
    if (n > LIMITS.introSentences) flag('error', where + ' \u00b7 intro', n + ' sentences. One, two at a push. The rest is a rule.');
  }
  if (!body.children.length) flag('error', where, 'Empty body. Delete the block rather than leaving it empty.');

  // anything wider than the column is clipped with no warning
  const wide = body.findAll(x => !hasInstanceAncestor(x) && 'width' in x && Math.round(x.width) > CONTENT);
  if (Math.round(body.width) > CONTENT) wide.unshift(body);
  for (const w of wide.slice(0, 3))
    flag('error', where, '"' + w.name + '" is ' + Math.round(w.width) + 'px inside a ' + CONTENT + 'px column. The right-hand end is clipped.');

  // captions: a text named "caption", or an instance whose name contains "caption"
  const caps = b.findAll(x => x.type === 'TEXT' && !hasInstanceAncestor(x) && /caption/i.test(x.name));
  const instCaps = b.findAll(x => x.type === 'INSTANCE' && /caption/i.test(x.name))
    .map(i => i.findOne(t => t.type === 'TEXT')).filter(Boolean);
  for (const c of [...caps, ...instCaps]) {
    const n = words(c.characters);
    if (n > LIMITS.captionWords) flag('error', where + ' \u00b7 caption', n + ' words: "' + c.characters.slice(0, 60) + '". Limit is ' + LIMITS.captionWords + '. Longer means it is a rule.');
  }

  // long prose loose on the canvas
  for (const t of texts(body)) {
    if (t.characters.length > LIMITS.looseParagraphChars)
      flag('error', where, 'A ' + t.characters.length + '-character paragraph: "' + t.characters.slice(0, 50) + '...". Prose lives in the left panel.');
  }
}

// ---------- rules ----------
const rulesBlock = blocks.find(b => b.name === 'rules');
const ruleTexts = [];
if (rulesBlock) {
  const rows = rulesBlock.findAll(x => x.name === 'rule' && !hasInstanceAncestor(x));
  if (rows.length > LIMITS.rules) flag('error', 'canvas \u00b7 rules', rows.length + ' rules. Limit is ' + LIMITS.rules + '.');
  rows.forEach((r, i) => {
    const t = named(r, 'text');
    if (!t) return;
    ruleTexts.push(t.characters);
    const lh = lineHeightOf(t);
    if (t.height > lh * 1.5) flag('warn', 'canvas \u00b7 rules', 'Rule ' + (i + 1) + ' wraps to ' + Math.round(t.height / lh) + ' lines. One line each.');
  });
}

// ---------- anatomy badges ----------
const anatomy = blocks.find(b => b.name === 'anatomy');
if (anatomy) {
  const keyN = anatomy.findAll(x => /^callout \d+$/.test(x.name)).length;
  const badgeN = anatomy.findAll(x => /^badge \d+$/.test(x.name)).length;
  if (keyN && !badgeN) flag('error', 'canvas \u00b7 anatomy', keyN + ' lines in the key and no badges on the specimen. A numbered key beside a bare specimen is a list, not an anatomy.');
  else if (keyN !== badgeN) flag('error', 'canvas \u00b7 anatomy', badgeN + ' badges on the specimen but ' + keyN + ' lines in the key.');
}

// ---------- the component: interaction contract and dead properties ----------
// The description is what developers and their agents build from, so a gap here ships.
const comp = sec && sec.type === 'SECTION'
  ? sec.children.find(c => c.type === 'COMPONENT' || c.type === 'COMPONENT_SET') : null;
if (comp) {
  const desc = comp.description || '';
  if (!desc.trim()) flag('error', 'description', 'The component has no description. That is the half of the docs developers and their agents read.');

  const defs = comp.componentPropertyDefinitions || {};
  const variantValues = Object.values(defs).filter(d => d.type === 'VARIANT').flatMap(d => d.variantOptions || []);
  const interactive =
    variantValues.some(v => /^(hover|hovered|focus|focused|open|opened|pressed|active|selected|expanded|editing|renaming)$/i.test(v)) ||
    /\b(opens?|closes?|collapses?|expands?|dismiss(es)?|clicks?|tap(s|ped)?|drag(s|ged)?)\b/i.test(desc);

  if (interactive) {
    const lines = desc.split('\n');
    const start = lines.findIndex(l => /^INTERACTION\b/.test(l.trim()));
    if (start < 0) {
      flag('error', 'description', 'Interactive, and no INTERACTION block. Answer ' + INTERACTION_LABELS.join(', ') + ' (references/doc-template.md, "The interaction contract").');
    } else {
      // a heading is an all-caps line, optionally with a note in brackets: "TONE (variant)"
      const isHeading = l => /^[A-Z][A-Z0-9 '\u2019&\/-]{2,}(\s*\(.*\))?$/.test(l.trim());
      let end = lines.length;
      for (let i = start + 1; i < lines.length; i++) if (isHeading(lines[i])) { end = i; break; }
      const blockText = lines.slice(start + 1, end).join('\n');
      for (const label of INTERACTION_LABELS) {
        // [ \t] not \s: \s crosses the line break and reads the next label as this one's answer
        const m = blockText.match(new RegExp('^[ \\t]*[\u00b7\u2022*-]?[ \\t]*' + label + ':[ \\t]*(.*)$', 'mi'));
        if (!m) flag('error', 'description \u00b7 interaction', 'No "' + label + ':" line. Write "none" if it does not apply; a missing line and a considered none look the same to whoever builds it.');
        else if (!m[1].trim()) flag('error', 'description \u00b7 interaction', '"' + label + ':" is empty.');
      }
    }
  }

  // a property nothing references still shows in the panel, and gets built
  const used = new Set();
  const collect = n => {
    for (const v of Object.values(n.componentPropertyReferences || {})) used.add(v);
    // walk into nested instances too: a property can be bound to a layer inside one
    if ('children' in n) n.children.forEach(collect);
  };
  (comp.type === 'COMPONENT_SET' ? comp.children : [comp]).forEach(collect);
  for (const [key, d] of Object.entries(defs)) {
    if (d.type === 'VARIANT') continue;
    if (!used.has(key)) flag('error', 'component \u00b7 ' + key.split('#')[0], 'Property "' + key.split('#')[0] + '" is used by no layer. Delete it: a dead property reads as a feature and gets built.');
  }
}

const errors = out.filter(o => o.level === 'error').length;
return {
  doc: doc.name,
  canvas: W,
  blocks: blocks.map(b => b.name),
  verdict: errors ? errors + ' violation(s)' : (out.length ? 'clean, with notes' : 'clean'),
  findings: out,
  // the checker cannot judge whether each rule is in the description; read these against it
  rulesToDiff: ruleTexts,
  description: comp ? (comp.description || '') : null,
};
