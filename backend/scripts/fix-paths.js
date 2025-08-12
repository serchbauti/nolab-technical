#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to replace @/* with relative paths
function fixPaths(filePath, depth = 0) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = '../'.repeat(depth);
  
  // Replace @/ with relative paths
  const fixedContent = content.replace(/@\//g, relativePath);
  
  fs.writeFileSync(filePath, fixedContent);
  console.log(`✅ Fixed paths in: ${filePath}`);
}

// Function to process directory recursively
function processDirectory(dirPath, depth = 0) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath, depth + 1);
    } else if (file.endsWith('.js')) {
      fixPaths(fullPath, depth);
    }
  }
}

// Process the dist directory
const distPath = path.join(__dirname, '../dist');
console.log('🔧 Fixing @/* paths in dist directory...');
processDirectory(distPath);
console.log('✅ All paths fixed!');
