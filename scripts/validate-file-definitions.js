const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TARGETS = [
  'amplify.yml',
  'scripts/package-aws-deployment.sh',
  'scripts/setup-windows-env.ps1',
  'docs/aws/s3-zip-deployment.md',
  'docs/vantage-runtime.md'
];

function findHereDocDelimiter(line) {
  const match = line.match(/<<-?\s*['"]?([A-Za-z_][A-Za-z0-9_]*)['"]?/);
  return match ? match[1] : null;
}

function validateFile(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const errors = [];
  const stack = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const active = stack[stack.length - 1];

    if (active && line.trim() === active.delimiter) {
      stack.pop();
      return;
    }

    if (!active) {
      const delimiter = findHereDocDelimiter(line);
      if (delimiter) {
        stack.push({ delimiter, lineNumber });
      }
    }
  });

  stack.forEach((item) => {
    errors.push(`${relativePath}:${item.lineNumber} opens here-doc ${item.delimiter} but no closing delimiter was found`);
  });

  const lastMeaningfulLineIndex = lines.map((line) => line.trim()).findLastIndex((line) => line.length > 0);
  if (lastMeaningfulLineIndex >= 0 && lines[lastMeaningfulLineIndex].trim().endsWith('\\')) {
    errors.push(`${relativePath}:${lastMeaningfulLineIndex + 1} ends with a continuation slash; complete or strip the partial block`);
  }

  return errors;
}

const errors = TARGETS.flatMap(validateFile);

if (errors.length > 0) {
  console.error('[FILE_DEFINITION_CHECK] Incomplete file definitions detected:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('[FILE_DEFINITION_CHECK] All checked file definitions are complete.');
