const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const templatePath = path.join(rootDir, 'index.template.html');
const indexPath = path.join(rootDir, 'index.html');

if (fs.existsSync(templatePath)) {
  fs.copyFileSync(templatePath, indexPath);
  console.log('[NaviGO] Prepared index.html from template for build/dev.');
}
