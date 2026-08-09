const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Muhammad Jawad M R\\.gemini\\antigravity-ide\\brain\\ce0a1780-7a35-4d6e-ad32-2cd42ba6f29e';
const destDir = path.join(__dirname, 'images');

// Create images directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('Created images/ directory');
}

// Map source files to destination names
const fileMap = {
  'dolo650_1786265205980.png': 'dolo650.png',
  'accu_chek_1786265221084.png': 'accu_chek.png',
  'volini_1786265238870.png': 'volini.png',
  'sebamed_baby_1786265255942.png': 'sebamed_baby.png',
  'omron_bp_1786265284322.png': 'omron_bp.png',
};

let count = 0;
for (const [src, dest] of Object.entries(fileMap)) {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${dest}`);
    count++;
  } else {
    console.log(`✗ Source not found: ${src}`);
  }
}
console.log(`\nDone. ${count} images copied to images/ directory.`);

