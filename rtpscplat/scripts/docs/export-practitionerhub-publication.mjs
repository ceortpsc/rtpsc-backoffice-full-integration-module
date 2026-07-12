#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const docsDir = path.join(repoRoot, 'docs', 'practitionerhub');
const exportDir = path.join(docsDir, 'exports');
const pdfDir = path.join(exportDir, 'pdf');
const sourceFiles = fs.readdirSync(docsDir)
    .filter((name) => /^\d{2}-.*\.md$/.test(name))
    .sort();

fs.mkdirSync(exportDir, { recursive: true });
fs.mkdirSync(pdfDir, { recursive: true });

function normalize(content) {
    return content.replace(/\r\n/g, '\n').trim() + '\n';
}

function runOrFail(command, args, errorMessage, options = {}) {
    const result = spawnSync(command, args, {
        stdio: 'pipe',
        encoding: 'utf8',
        windowsHide: true,
        ...options
    });

    if (result.error) {
        throw new Error(`${errorMessage}: ${result.error.message}`);
    }

    if (result.status !== 0) {
        const stderr = (result.stderr || '').trim();
        const stdout = (result.stdout || '').trim();
        throw new Error(`${errorMessage}: ${stderr || stdout || `exit ${result.status}`}`);
    }

    return result;
}

function resolveEdgePath() {
    const candidates = [
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
    ];

    return candidates.find((candidate) => fs.existsSync(candidate));
}

function toFileUrl(filePath) {
    const normalized = filePath.replace(/\\/g, '/');
    return `file:///${normalized}`;
}

const edgePath = resolveEdgePath();
if (!edgePath) {
    console.error('[publication] Microsoft Edge executable not found.');
    process.exit(1);
}

runOrFail('pandoc', ['--version'], 'pandoc availability check failed');

const generated = [];

for (const sourceFile of sourceFiles) {
    const sourcePath = path.join(docsDir, sourceFile);
    const source = fs.readFileSync(sourcePath, 'utf8');
    const sectionNumber = sourceFile.slice(0, 2);
    const exportBaseName = `section${sectionNumber}-master`;
    const markdownPath = path.join(exportDir, `${exportBaseName}.md`);
    const htmlPath = path.join(exportDir, `${exportBaseName}.html`);
    const pdfPath = path.join(pdfDir, `${exportBaseName}.pdf`);

    fs.writeFileSync(markdownPath, normalize(source));

    runOrFail(
        'pandoc',
        [markdownPath, '-o', htmlPath, '--standalone', '--mathjax'],
        `[publication] HTML export failed for ${sourceFile}`,
        { timeout: 120000 }
    );

    runOrFail(
        edgePath,
        [
            '--headless',
            '--disable-gpu',
            '--allow-file-access-from-files',
            `--print-to-pdf=${pdfPath}`,
            toFileUrl(htmlPath)
        ],
        `[publication] PDF export failed for ${sourceFile}`,
        { timeout: 180000 }
    );

    if (!fs.existsSync(pdfPath)) {
        throw new Error(`[publication] PDF artifact missing for ${sourceFile}`);
    }

    fs.rmSync(htmlPath, { force: true });
    generated.push(path.basename(pdfPath));
    console.log(`[publication] Generated ${path.basename(pdfPath)}`);
}

console.log(`[publication] Completed ${generated.length} standalone section PDFs.`);