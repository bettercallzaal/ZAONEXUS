#!/usr/bin/env node
/**
 * Integrity guard for the canonical link dataset (`app/data/links.json`).
 *
 * `links.json` is the single source of truth: it is bundled at build time AND
 * fetched live from raw GitHub at runtime, so a malformed entry ships to the
 * site with no redeploy. This validator is the gate that keeps that from
 * happening — run it in CI on every PR and locally before committing data.
 *
 *   node scripts/validate-links.mjs
 *
 * Exits non-zero on any ERROR (blocks merge); WARNINGs are advisory and do not
 * fail the run. Keep the rules here in sync with the `FlatLink` type and the
 * `/api/links` contract.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '..', 'app', 'data', 'links.json');

// Mirror of CATEGORY_ORDER in app/data/links.ts — entries outside this set
// still render (appended last) but are flagged so typos don't quietly create
// a brand-new category.
const KNOWN_CATEGORIES = [
  'The ZAO', 'ZAO OS', 'Agents & Bots', 'ZAO Festivals', 'Community Projects',
  'ZAO Members', 'Ecosystem & Tokens', 'ZAO Onchain', 'ZAO Stock',
];
const AUDIENCES = ['community', 'ecosystem', 'both'];
const STATUSES = ['live', 'down', 'paused'];

const norm = u => {
  try {
    const x = new URL(u);
    x.hash = '';                 // same page, different anchor = same link
    return x.href.replace(/\/$/, '').toLowerCase();
  } catch { return String(u).toLowerCase(); }
};

const errors = [];
const warnings = [];
const at = (i, msg) => `#${i} ${msg}`;

// Links render in an <a href>, so any scheme the browser follows is valid —
// http(s) for pages, mailto: for the ZAO contact address.
function isValidUrl(u) {
  try { const x = new URL(u); return ['http:', 'https:', 'mailto:'].includes(x.protocol); }
  catch { return false; }
}

async function run() {
  let raw;
  try {
    raw = JSON.parse(await readFile(DATA, 'utf8'));
  } catch (e) {
    console.error(`✖ links.json is not valid JSON: ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(raw)) {
    console.error('✖ links.json must be a top-level array');
    process.exit(1);
  }

  const seen = new Map(); // normalized url -> first index
  raw.forEach((l, i) => {
    if (!l || typeof l !== 'object') { errors.push(at(i, 'entry is not an object')); return; }

    // Required fields
    if (!l.title || typeof l.title !== 'string' || !l.title.trim()) errors.push(at(i, 'missing/empty "title"'));
    if (!l.category || typeof l.category !== 'string' || !l.category.trim()) errors.push(at(i, 'missing/empty "category"'));
    if (!l.url || typeof l.url !== 'string') errors.push(at(i, 'missing "url"'));
    else if (!isValidUrl(l.url)) errors.push(at(i, `"url" is not a valid URL: ${l.url}`));

    // Enums
    if (l.audience !== undefined && !AUDIENCES.includes(l.audience)) errors.push(at(i, `invalid "audience": ${l.audience} (expected ${AUDIENCES.join('|')})`));
    if (l.status !== undefined && !STATUSES.includes(l.status)) errors.push(at(i, `invalid "status": ${l.status} (expected ${STATUSES.join('|')})`));

    // Optional-field shapes
    if (l.featured !== undefined && typeof l.featured !== 'boolean') errors.push(at(i, '"featured" must be a boolean'));
    if (l.description !== undefined && typeof l.description !== 'string') errors.push(at(i, '"description" must be a string'));
    if (l.tags !== undefined && (!Array.isArray(l.tags) || l.tags.some(t => typeof t !== 'string'))) errors.push(at(i, '"tags" must be an array of strings'));
    if (l.addedDate !== undefined && (typeof l.addedDate !== 'string' || isNaN(Date.parse(l.addedDate)))) errors.push(at(i, `"addedDate" must be a parseable date: ${l.addedDate}`));

    // Advisory
    if (l.category && !KNOWN_CATEGORIES.includes(l.category)) warnings.push(at(i, `unknown category "${l.category}" — will render last; typo?`));
    if (l.title && l.title.length > 80) warnings.push(at(i, `title is ${l.title.length} chars (long)`));
    if (l.description !== undefined && l.description !== '' && l.description.length > 200) warnings.push(at(i, `description is ${l.description.length} chars (long)`));

    // Duplicate URLs (normalized)
    if (l.url && isValidUrl(l.url)) {
      const n = norm(l.url);
      if (seen.has(n)) warnings.push(at(i, `duplicate URL of #${seen.get(n)}: ${l.url}`));
      else seen.set(n, i);
    }
  });

  const ok = errors.length === 0;
  console.log(`\nZAO Nexus — links.json validation`);
  console.log(`  entries:  ${raw.length}`);
  console.log(`  unique URLs: ${seen.size}`);
  console.log(`  errors:   ${errors.length}`);
  console.log(`  warnings: ${warnings.length}`);

  if (warnings.length) {
    console.log('\nWarnings (advisory):');
    warnings.forEach(w => console.log(`  ⚠ ${w}`));
  }
  if (errors.length) {
    console.log('\nErrors (must fix):');
    errors.forEach(e => console.log(`  ✖ ${e}`));
  }

  console.log(ok ? '\n✓ links.json is valid.\n' : '\n✖ links.json has errors — fix the above.\n');
  process.exit(ok ? 0 : 1);
}

run().catch(e => { console.error(e); process.exit(1); });
