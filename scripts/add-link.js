#!/usr/bin/env node

/**
 * Quick Link Addition Script for ZAO Nexus
 * 
 * Usage:
 *   node scripts/add-link.js
 * 
 * This interactive script helps you add new links to the ZAO Nexus
 * with proper categorization and formatting.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const CATEGORIES = [
  'ZAO Onchain',
  'ZAO Links',
  'ZAO Projects Links',
  'ZAO Community Links',
  'ZAO Community Members'
];

async function main() {
  console.log('\n🔗 ZAO NEXUS - Quick Link Addition Tool\n');
  console.log('This tool helps you add new links to the Nexus.\n');

  // Get link details
  const title = await question('Link Title: ');
  const url = await question('URL: ');
  const description = await question('Description: ');

  // Show categories
  console.log('\nAvailable Categories:');
  CATEGORIES.forEach((cat, idx) => {
    console.log(`  ${idx + 1}. ${cat}`);
  });
  
  const categoryIdx = parseInt(await question('\nSelect Category (1-5): ')) - 1;
  const mainCategory = CATEGORIES[categoryIdx];

  const subTitle = await question('Subcategory Name (e.g., "WaveWarZ", "ZAO Tokens"): ');

  // Confirm
  console.log('\n📋 Preview:');
  console.log(`  Category: ${mainCategory}`);
  console.log(`  Subcategory: ${subTitle}`);
  console.log(`  Title: ${title}`);
  console.log(`  URL: ${url}`);
  console.log(`  Description: ${description}`);

  const confirm = await question('\nAdd this link? (y/n): ');
  
  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Cancelled');
    rl.close();
    return;
  }

  // Read current data
  const dataPath = path.join(__dirname, '../app/data/links.ts');
  let content = fs.readFileSync(dataPath, 'utf8');

  // Create link object string
  const linkObj = `      { title: "${title}", url: "${url}", description: "${description}" }`;

  // Find the category and subcategory
  const categoryRegex = new RegExp(`mainCategory: "${mainCategory}"[\\s\\S]*?subcategories: \\[`, 'g');
  const categoryMatch = categoryRegex.exec(content);

  if (!categoryMatch) {
    console.log(`❌ Category "${mainCategory}" not found`);
    rl.close();
    return;
  }

  // Find subcategory
  const subCategoryRegex = new RegExp(`subTitle: "${subTitle}"[\\s\\S]*?links: \\[([\\s\\S]*?)\\]`, 'g');
  const subMatch = subCategoryRegex.exec(content);

  if (subMatch) {
    // Subcategory exists, add to it
    const linksArray = subMatch[1];
    const lastLinkIndex = content.indexOf(linksArray) + linksArray.length;
    
    // Insert before the closing bracket
    const insertPosition = content.lastIndexOf(']', lastLinkIndex);
    const beforeInsert = content.substring(0, insertPosition);
    const afterInsert = content.substring(insertPosition);
    
    // Add comma if there are existing links
    const needsComma = linksArray.trim().length > 0;
    const newContent = beforeInsert + (needsComma ? ',\n' : '\n') + linkObj + '\n    ' + afterInsert;
    
    fs.writeFileSync(dataPath, newContent, 'utf8');
    console.log('\n✅ Link added successfully!');
  } else {
    console.log(`\n⚠️  Subcategory "${subTitle}" not found.`);
    const createNew = await question('Create new subcategory? (y/n): ');
    
    if (createNew.toLowerCase() === 'y') {
      // Create new subcategory
      const newSubcategory = `    {\n      subTitle: "${subTitle}",\n      links: [\n${linkObj}\n      ]\n    }`;
      
      // Find where to insert (after last subcategory in this category)
      const categoryEndRegex = new RegExp(`mainCategory: "${mainCategory}"[\\s\\S]*?subcategories: \\[([\\s\\S]*?)\\]\\s*\\}`, 'g');
      const categoryEndMatch = categoryEndRegex.exec(content);
      
      if (categoryEndMatch) {
        const subcategoriesContent = categoryEndMatch[1];
        const insertPos = content.indexOf(subcategoriesContent) + subcategoriesContent.length;
        const beforeInsert = content.substring(0, insertPos);
        const afterInsert = content.substring(insertPos);
        
        const needsComma = subcategoriesContent.trim().length > 0;
        const newContent = beforeInsert + (needsComma ? ',\n' : '\n') + newSubcategory + '\n  ' + afterInsert;
        
        fs.writeFileSync(dataPath, newContent, 'utf8');
        console.log('\n✅ New subcategory and link added successfully!');
      }
    } else {
      console.log('❌ Cancelled');
    }
  }

  rl.close();
}

main().catch(console.error);
