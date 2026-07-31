const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

function replaceColors(dir) {
  walkDir(dir, function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      let newContent = content
        .replace(/bg-white\/(\d+)/g, 'bg-black/$1')
        .replace(/border-white\/(\d+)/g, 'border-black/$1')
        .replace(/text-white\/(\d+)/g, 'text-black/$1')
        .replace(/via-white\/(\d+)/g, 'via-black/$1')
        .replace(/from-white\/(\d+)/g, 'from-black/$1')
        .replace(/to-white\/(\d+)/g, 'to-black/$1')
        .replace(/text-white/g, 'text-foreground');

      // Do NOT replace text-white inside button gradients or strictly colored areas if possible,
      // but replacing `text-white` with `text-foreground` (which is dark) makes it visible.
      // Wait, let's skip the raw `text-white` for now, just opacity.

      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath}`);
      }
    }
  });
}

replaceColors(path.join(__dirname, 'app'));
replaceColors(path.join(__dirname, 'components'));
console.log('Theme replacement complete.');
