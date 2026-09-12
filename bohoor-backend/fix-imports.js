import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match import/export from relative paths that don't end in .js already
  let modified = false;
  content = content.replace(/(import|export)\s+(?:.*)\s+from\s+['"](\.\.?\/[^'"]+)['"]/g, (match, p1, p2) => {
    if (!p2.endsWith('.js') && !p2.endsWith('.json')) {
      modified = true;
      return match.replace(p2, p2 + '.js');
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
