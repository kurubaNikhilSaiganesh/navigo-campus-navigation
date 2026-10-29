const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const assetsDir = path.join(rootDir, 'assets');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

if (fs.existsSync(distDir)) {
  // 1. Clean docs/assets/ and sync dist/ to docs/ (preserving existing .md docs)
  const docsAssets = path.join(docsDir, 'assets');
  if (fs.existsSync(docsAssets)) {
    cleanDir(docsAssets);
  }
  copyDirRecursive(distDir, docsDir);
  console.log('[NaviGO] Synced fresh compiled bundle to docs/');

  // 2. Clean root assets/ and copy dist/assets/ into assets/
  const distAssets = path.join(distDir, 'assets');
  if (fs.existsSync(distAssets)) {
    cleanDir(assetsDir);
    copyDirRecursive(distAssets, assetsDir);
    console.log('[NaviGO] Cleaned and synced fresh compiled assets to root assets/');
  }

  // 3. Copy top-level static files from dist/ to root (index.html, 404.html, logos, etc.)
  const distEntries = fs.readdirSync(distDir, { withFileTypes: true });
  for (const entry of distEntries) {
    if (!entry.isDirectory()) {
      const srcFile = path.join(distDir, entry.name);
      const destFile = path.join(rootDir, entry.name);
      fs.copyFileSync(srcFile, destFile);
    }
  }
  console.log('[NaviGO] Synced compiled root index.html, 404.html, and static public assets to repository root.');

  // 4. Ensure .nojekyll in root and docs
  fs.writeFileSync(path.join(rootDir, '.nojekyll'), '');
  fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');
  console.log('[NaviGO] Ensured .nojekyll in root and docs/.');
}
