#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const sourcePath = path.join(repoRoot, 'docs', 'practitionerhub', '15-enterprise-blueprint-compendium.md');
const exportDir = path.join(repoRoot, 'docs', 'practitionerhub', 'exports');
const pdfDir = path.join(exportDir, 'pdf');
const shouldSkipPdf = process.argv.includes('--skip-pdf') || process.env.EXPORT_SECTION15_SKIP_PDF === '1';

if (!fs.existsSync(sourcePath)) {
  console.error(`[export] Source file missing: ${sourcePath}`);
  process.exit(1);
}

const source = fs.readFileSync(sourcePath, 'utf8');
fs.mkdirSync(exportDir, { recursive: true });
fs.mkdirSync(pdfDir, { recursive: true });

function normalize(content) {
  return content.replace(/\r\n/g, '\n').trim() + '\n';
}

function getSection(startHeading, endHeading) {
  const start = source.indexOf(startHeading);
  if (start === -1) {
    throw new Error(`Missing start heading: ${startHeading}`);
  }

  const end = endHeading ? source.indexOf(endHeading, start + startHeading.length) : -1;
  const slice = end === -1 ? source.slice(start) : source.slice(start, end);
  return normalize(slice);
}

function writeVolume(fileName, title, contentBlocks) {
  const content = [
    `# ${title}`,
    '',
    '> Generated from Section 15 master compendium.',
    '',
    ...contentBlocks,
  ].join('\n');
  fs.writeFileSync(path.join(exportDir, fileName), normalize(content));
}

// Primary PDF master source copy
fs.writeFileSync(path.join(exportDir, 'section15-master.md'), normalize(source));

const control = getSection('## 1. Document Control', '## 2. Brand and Print Design Specification');
const brand = getSection('## 2. Brand and Print Design Specification', '## 3. Conceptual Platform Overview');
const overview = getSection('## 3. Conceptual Platform Overview', '## 4. Layered Blueprint (All Layers)');
const l41 = getSection('## 4.1 Physical and Infrastructure Layer (Volume A)', '## 4.2 Platform Services Layer (Volume B)');
const l42 = getSection('## 4.2 Platform Services Layer (Volume B)', '## 4.3 Data Layer (Volume C)');
const l43 = getSection('## 4.3 Data Layer (Volume C)', '## 4.4 Application and Domain Services Layer (Volume D)');
const l44 = getSection('## 4.4 Application and Domain Services Layer (Volume D)', '## 4.5 Integration Layer (Volume E)');
const l45 = getSection('## 4.5 Integration Layer (Volume E)', '## 4.6 Security and Compliance Layer (Volume F)');
const l46 = getSection('## 4.6 Security and Compliance Layer (Volume F)', '## 4.7 Presentation and UX Layer (Volume G)');
const l47 = getSection('## 4.7 Presentation and UX Layer (Volume G)', '## 4.8 Operations and Observability Layer (Volume H)');
const l48 = getSection('## 4.8 Operations and Observability Layer (Volume H)', '## 5. Mathematical and Scientific Rigor Appendix');
const m51 = getSection('## 5.1 Performance and Queueing', '## 5.2 Reliability and Availability');
const m52 = getSection('## 5.2 Reliability and Availability', '## 5.3 Capacity Growth');
const m53 = getSection('## 5.3 Capacity Growth', '## 5.4 Security Risk Modeling');
const m54 = getSection('## 5.4 Security Risk Modeling', '## 5.5 Algorithmic Complexity Notes');
const m55 = getSection('## 5.5 Algorithmic Complexity Notes', '## 6. API, Data, and Integration Governance');
const governance = getSection('## 6. API, Data, and Integration Governance', '## 7. Standalone Volume Export Plan');
const references = getSection('## 8. References', '## 9. Glossary');
const glossary = getSection('## 9. Glossary', null);

writeVolume('volume-architecture.md', 'RossTax PrimePlatform Architecture Volume', [control, brand, overview, l41, l42, l43, l44, l45, references, glossary]);
writeVolume('volume-security.md', 'RossTax PrimePlatform Security Volume', [control, brand, l46, governance, m54, references, glossary]);
writeVolume('volume-operations.md', 'RossTax PrimePlatform Operations Volume', [control, brand, l48, m51, m52, references, glossary]);
writeVolume('volume-ux.md', 'RossTax PrimePlatform UX Volume', [control, brand, l47, references, glossary]);
writeVolume('volume-mathematics.md', 'RossTax PrimePlatform Mathematical Appendix Volume', [control, brand, getSection('## 5. Mathematical and Scientific Rigor Appendix', '## 6. API, Data, and Integration Governance'), references, glossary]);

const volumeFiles = [
  'section15-master.md',
  'volume-architecture.md',
  'volume-security.md',
  'volume-operations.md',
  'volume-ux.md',
  'volume-mathematics.md',
];

console.log('[export] Markdown volume export completed.');

if (shouldSkipPdf) {
  console.log('[export] PDF conversion skipped by flag (use --skip-pdf or EXPORT_SECTION15_SKIP_PDF=1).');
  process.exit(0);
}

function hasCommand(cmd) {
  const check = process.platform === 'win32'
    ? spawnSync('where', [cmd], { stdio: 'ignore' })
    : spawnSync('which', [cmd], { stdio: 'ignore' });
  return check.status === 0;
}

const pandocAvailable = hasCommand('pandoc');
if (!pandocAvailable) {
  console.log('[export] pandoc not found; markdown export completed without PDF conversion.');
  process.exit(0);
}

for (const file of volumeFiles) {
  const input = path.join(exportDir, file);
  const output = path.join(pdfDir, file.replace(/\.md$/, '.pdf'));
  const result = spawnSync('pandoc', [input, '-o', output], {
    stdio: 'inherit',
    timeout: 120000
  });
  if (result.error && result.error.code === 'ETIMEDOUT') {
    console.error(`[export] PDF conversion timed out for ${file}. Re-run with --skip-pdf to bypass PDF generation.`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`[export] PDF conversion failed for ${file}`);
    process.exit(result.status ?? 1);
  }
}

console.log('[export] Markdown and PDF exports completed.');
