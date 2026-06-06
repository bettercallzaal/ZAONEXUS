#!/usr/bin/env node

/**
 * Quick Link Addition Script for ZAO Nexus
 *
 * Usage:
 *   node scripts/add-link.js
 *
 * Interactive helper that appends a new link to the canonical, flat
 * `app/data/links.json` (the source of truth the live site syncs from).
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Canonical top-level categories (keep in sync with CATEGORY_ORDER in app/data/links.ts).
const CATEGORIES = [
  'The ZAO',
  'ZAO OS',
  'Agents & Bots',
  'ZAO Festivals',
  'Community Projects',
  'ZAO Members',
  'Ecosystem & Tokens',
  'ZAO Onchain',
  'ZAO Stock',
];

const AUDIENCES = ['community', 'ecosystem', 'both'];

async function main() {
  console.log('\n🔗 ZAO NEXUS - Quick Link Addition Tool\n');

  const dataPath = path.join(__dirname, '../app/data/links.json');
  const links = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const title = (await question('Link Title: ')).trim();
  const url = (await question('URL: ')).trim();
  const description = (await question('Description (optional): ')).trim();

  console.log('\nAvailable Categories:');
  CATEGORIES.forEach((cat, idx) => console.log(`  ${idx + 1}. ${cat}`));
  const categoryIdx = parseInt(await question(`\nSelect Category (1-${CATEGORIES.length}): `), 10) - 1;
  const category = CATEGORIES[categoryIdx];

  if (!category) {
    console.log('❌ Invalid category');
    rl.close();
    return;
  }

  // Suggest existing subcategories in the chosen category.
  const existingSubs = [...new Set(links.filter(l => l.category === category).map(l => l.subcategory).filter(Boolean))];
  if (existingSubs.length) console.log(`\nExisting subcategories in "${category}": ${existingSubs.join(', ')}`);
  const subcategory = (await question('Subcategory (e.g., "WaveWarZ", "ZAO Tokens"): ')).trim();

  console.log('\nAudience:');
  AUDIENCES.forEach((a, idx) => console.log(`  ${idx + 1}. ${a}`));
  const audienceIdx = parseInt(await question('Select Audience (1-3) [default 3=both]: '), 10) - 1;
  const audience = AUDIENCES[audienceIdx] || 'both';

  const tagsRaw = (await question('Tags (comma-separated, optional): ')).trim();
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : undefined;

  if (!title || !url) {
    console.log('❌ Title and URL are required');
    rl.close();
    return;
  }

  const entry = { title, url, category };
  if (subcategory) entry.subcategory = subcategory;
  if (description) entry.description = description;
  if (tags && tags.length) entry.tags = tags;
  entry.audience = audience;

  console.log('\n📋 Preview:');
  console.log(JSON.stringify(entry, null, 2));

  const confirm = await question('\nAdd this link? (y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Cancelled');
    rl.close();
    return;
  }

  links.push(entry);
  fs.writeFileSync(dataPath, JSON.stringify(links, null, 2) + '\n', 'utf8');
  console.log(`\n✅ Link added. links.json now has ${links.length} entries.`);
  console.log('   Commit & push to main to update the live site (no redeploy needed).');

  rl.close();
}

main().catch((err) => { console.error(err); rl.close(); });
