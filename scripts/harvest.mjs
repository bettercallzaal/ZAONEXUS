#!/usr/bin/env node
/**
 * Auto-harvest scaffold for ZAO Nexus.
 *
 * Re-fetches the canonical ZABAL Gamez data sources, extracts URLs, dedupes
 * against the live links.json, drops infra/templated/external noise, and writes
 * a review report (harvest-candidates.md) listing only *net-new* candidate links.
 *
 * It deliberately does NOT edit links.json — curation (category/audience/tags,
 * and "is this really a ZAO link?") stays human-in-the-loop. The companion
 * workflow runs this weekly and opens an issue with the report.
 *
 * Run locally: `node scripts/harvest.mjs`  (exit 0 always; report is the output)
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '..', 'app', 'data', 'links.json');
const REPORT = join(__dirname, '..', 'harvest-candidates.md');

const SOURCES = [
  'https://raw.githubusercontent.com/ZAODEVZ/zabalgames/main/data/adoptable-projects.json',
  'https://raw.githubusercontent.com/ZAODEVZ/zabalgames/main/data/data-streams.json',
  'https://raw.githubusercontent.com/ZAODEVZ/zabalgames/main/data/workshop-leads.json',
  'https://raw.githubusercontent.com/ZAODEVZ/zabalgames/main/data/bonfire-graph.json',
];

// Drop these: infra, templated, internal docs, external tooling, known-dead.
const NOISE = [
  /githubusercontent\.com/i, /\/blob\/|\/tree\/|\/pull\//i,
  /[{}\[\]<>]/, /\bapi\.|\/api(\/|$)|-ingest\.|webhook|\/mcp\b|\.well-known/i,
  /schema\.org|w3\.org|example\.com|localhost|placeholder/i,
  /polymarket|alchemy\.com|helius\.dev|arweave|coinbase|x402|goldsky|formspree|core\.telegram/i,
  /gmfarcaster|farhack|bountycaster/i,
  /fishbowlz\.xyz|wavewarz\.io|chat\.zaoos\.com|zao\.gg/i, // removed-dead / placeholder
];

const norm = u => u.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[?#].*$/, '').replace(/\/$/, '').toLowerCase();

async function get(url) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'zao-nexus-harvest' } });
    return res.ok ? await res.text() : '';
  } catch { return ''; }
}

async function run() {
  const links = JSON.parse(await readFile(DATA, 'utf8'));
  const have = new Set(links.map(l => norm(l.url)));

  const found = new Map(); // norm -> { url, sources:Set }
  for (const src of SOURCES) {
    const raw = await get(src);
    if (!raw) { console.error('fetch failed:', src); continue; }
    const srcName = src.split('/').pop();
    const urls = raw.match(/https?:\/\/[^"'\\ )]+/g) || [];
    for (let u of urls) {
      u = u.replace(/[).,]+$/, '');
      const n = norm(u);
      if (have.has(n)) continue;
      if (NOISE.some(re => re.test(u))) continue;
      if (!found.has(n)) found.set(n, { url: u, sources: new Set() });
      found.get(n).sources.add(srcName);
    }
  }

  // Connected source: BetterCallZaal's coding hub (the full BCZ repo index).
  // It lists everything (incl. client/utility/test repos), so we only surface
  // ZAO-ecosystem repos by keyword and skip archived/old-version names — that
  // way new ZAO projects added to the hub auto-appear here for review without
  // dragging in noise.
  const CODING_HUB = 'https://raw.githubusercontent.com/bettercallzaal/bettercallzaal-coding-hub/main/projects.json';
  const ZAO_RE = /\b(zao|zabal|wavewarz|warz|fractal|loanz|songjam|poidh|nexus|midi|zounz|zalora|coc|concert|stock|zlank|fishbowl|snap|empire|bonfire|yapz|aurdour|zuke)\b/i;
  const SKIP_NAME = /(archive|old|test\d|v1$|feb20|mar(ch)?20|dec20|nov20)/i;
  try {
    const raw = await get(CODING_HUB);
    const projects = raw ? JSON.parse(raw) : [];
    for (const p of projects) {
      if (!p?.url) continue;
      const n = norm(p.url);
      if (have.has(n) || NOISE.some(re => re.test(p.url))) continue;
      if (!ZAO_RE.test(`${p.name} ${p.description || ''}`)) continue;
      if (SKIP_NAME.test(p.name)) continue;
      if (!found.has(n)) found.set(n, { url: p.url, sources: new Set() });
      found.get(n).sources.add('coding-hub');
    }
  } catch { /* coding hub optional */ }

  const candidates = [...found.values()].sort((a, b) => a.url.localeCompare(b.url));
  const lines = [
    '# ZAO Nexus — harvest candidates',
    '',
    `Net-new URLs found in the canonical ZABAL Gamez sources + the BetterCallZaal coding hub that are **not** in the directory (${links.length} links) and aren't infra/templated/external noise. Vet each, then add the real ones to \`app/data/links.json\`.`,
    '',
    `- Sources scanned: ${SOURCES.length + 1}`,
    `- Candidates: **${candidates.length}**`,
    `- Generated: ${new Date().toISOString()}`,
    '',
  ];
  if (candidates.length) {
    lines.push('| URL | Seen in |', '|---|---|');
    for (const c of candidates) lines.push(`| ${c.url} | ${[...c.sources].join(', ')} |`);
  } else {
    lines.push('No new candidates — the directory is current with these sources. 🎉');
  }
  const report = lines.join('\n') + '\n';
  await writeFile(REPORT, report);
  console.log(report);
}

run().catch(e => { console.error(e); process.exit(0); });
