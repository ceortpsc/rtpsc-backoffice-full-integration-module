const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ignoredSegments = new Set(['.git', 'node_modules', 'dist']);
const errors = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.relative(ROOT, absolutePath);
    if ([...ignoredSegments].some((segment) => relativePath.split(path.sep).includes(segment))) {
      continue;
    }
    if (entry.isDirectory()) {
      walk(absolutePath);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.json')) {
      continue;
    }
    const content = fs.readFileSync(absolutePath, 'utf8');
    try {
      JSON.parse(content);
    } catch (error) {
      errors.push(`${relativePath}: ${error.message}`);
    }
  }
}

walk(ROOT);

if (errors.length > 0) {
  console.error('[JSON_VALIDATION] Invalid JSON files found:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('[JSON_VALIDATION] All JSON files are valid.');
