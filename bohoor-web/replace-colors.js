const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src/app', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replacements
    content = content.replace(/indigo-900/g, 'primary');
    content = content.replace(/indigo-800/g, 'primary/90');
    content = content.replace(/indigo-700/g, 'accent');
    content = content.replace(/indigo-600/g, 'primary');
    content = content.replace(/indigo-500/g, 'accent/80');
    content = content.replace(/indigo-400/g, 'accent/60');
    content = content.replace(/indigo-200/g, 'primary/30');
    content = content.replace(/indigo-100/g, 'primary/20');
    content = content.replace(/indigo-50/g, 'primary/10');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
