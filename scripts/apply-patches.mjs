#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const packagePath = 'node_modules/@aztec/bb.js';

const files = [
  'dest/browser/index.js',
  'dest/browser/main.worker.js',
  'dest/browser/thread.worker.js'
];

files.forEach(file => {
  const filePath = join(packagePath, file);
  try {
    let content = readFileSync(filePath, 'utf8');
    content = content.replace(/^var __webpack_exports__ = {};$/gm, '// var __webpack_exports__ = {};');
    writeFileSync(filePath, content);
    console.log(`✅ Patched ${file}`);
  } catch (err) {
    console.log(`❌ Failed to patch ${file}:`, err.message);
  }
});
