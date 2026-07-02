#!/usr/bin/env node
/**
 * Link-health checker for app/data/links.json.
 *
 * Fetches every link and reports any that are unreachable or return a 4xx/5xx.
 * Designed to run in CI (see .github/workflows/link-health.yml) but also works
 * locally: `node scripts/check-links.mjs`.
 *
 * Exit code 0 = all good, 1 = one or more dead links (or a usage error).
 * Writes a Markdown summary to link-health-report.md for the workflow to surface.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '..', 'app', 'data', 'links.json');
const REPORT = join(__dirname, '..', 'link-health-report.md');

const CONCURRENCY = 12;
const TIMEOUT_MS = 20000;
const RETRIES = 2; // total attempts = RETRIES + 1
const UA =
  'Mozilla/5.0 (compatible; ZAONexusLinkHealth/1.0; +https://nexus.thezao.com)';

/** Fetch a single URL, following redirects, with a timeout. Returns {ok, status, error}. */
async function probe(url, method = 'HEAD') {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: '*/*' },
    });
    // Some servers reject HEAD (405/403/501) but serve GET fine — retry with GET.
    if (method === 'HEAD' && [403, 405, 501, 400].includes(res.status)) {
      clearTimeout(t);
      return probe(url, 'GET');
    }
    return { ok: res.status < 400, status: res.status };
  } catch (err) {
    return { ok: false, status: 0, error: err.name === 'AbortError' ? 'timeout' : err.message };
  } finally {
    clearTimeout(t);
  }
}

/** Probe with retries + small backoff to avoid flaky failures. */
async function checkOne(link) {
  let last;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    last = await probe(link.url);
    if (last.ok) break;
    if (attempt < RETRIES) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
  }
  return { ...link, ...last };
}

async function run() {
  const links = JSON.parse(await readFile(DATA, 'utf8'));
  const urls = links.filter(l => l.url && /^https?:\/\//.test(l.url));
  console.log(`Checking ${urls.length} links (concurrency ${CONCURRENCY})...`);

  const results = [];
  let i = 0;
  async function worker() {
    while (i < urls.length) {
      const idx = i++;
      const r = await checkOne(urls[idx]);
      results.push(r);
      if (!r.ok) console.log(`  DEAD [${r.status || r.error}] ${r.url}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const dead = results.filter(r => !r.ok).sort((a, b) => (a.category || '').localeCompare(b.category || ''));
  const lines = [];
  lines.push(`# Link health report`);
  lines.push('');
  lines.push(`- Checked: **${results.length}**`);
  lines.push(`- Healthy: **${results.length - dead.length}**`);
  lines.push(`- Dead/unreachable: **${dead.length}**`);
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push('');
  if (dead.length) {
    lines.push(`## Dead links`);
    lines.push('');
    lines.push(`| Status | Category | Title | URL |`);
    lines.push(`|---|---|---|---|`);
    for (const d of dead) {
      const escapePipes = (s) => (s || '').replace(/\|/g, '\\|');
      lines.push(`| ${escapePipes(d.status || d.error)} | ${escapePipes(d.category)} | ${escapePipes(d.title)} | ${escapePipes(d.url)} |`);
    }
  } else {
    lines.push(`All links healthy. 🎉`);
  }
  const report = lines.join('\n') + '\n';
  await writeFile(REPORT, report);
  console.log('\n' + report);

  // `--write` stamps status onto links.json so the UI can badge dead links.
  // Dead → status:'down'; healthy → clear any stale 'down' (leave 'paused' alone).
  if (process.argv.includes('--write')) {
    const deadUrls = new Set(dead.map(d => d.url));
    let changed = 0;
    for (const l of links) {
      if (deadUrls.has(l.url)) {
        if (l.status !== 'down') { l.status = 'down'; changed++; }
      } else if (l.status === 'down') {
        delete l.status; changed++;
      }
    }
    if (changed) {
      await writeFile(DATA, JSON.stringify(links, null, 2) + '\n');
      console.log(`\n--write: updated status on ${changed} link(s) in links.json`);
    } else {
      console.log('\n--write: no status changes');
    }
  }

  process.exit(dead.length ? 1 : 0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
