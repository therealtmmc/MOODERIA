import fs from 'fs';
import path from 'path';

function walkDir(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const classesToRemove = [
  /border-b-4/g,
  /border-b-8/g,
  /active:border-b-0/g,
  /active:translate-y-1/g,
  /active:translate-y-2/g,
  /active:translate-y-0\.5/g,
  /shadow-lg/g,
  /shadow-xl/g,
  /shadow-md/g,
  /shadow-sm/g,
  /border-gray-200/g,
  /border-gray-100/g,
  /border-blue-700/g,
  /border-red-700/g,
  /border-amber-700/g,
  /border-indigo-800/g,
  /border-purple-800/g,
  /border-green-700/g,
  /border-\[\#[0-9a-fA-F]+\]/g,
  /border-2/g,
  /border-4/g,
  /border-8/g,
  /border-t-\[8px\]/g,
  /border-l-\[12px\]/g,
  /border-b-\[8px\]/g,
  /border-t-transparent/g,
  /border-l-white/g,
  /border-b-transparent/g,
  /border-transparent/g,
  /border/g
];

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    classesToRemove.forEach(regex => {
      content = content.replace(regex, '');
    });
    
    // clean up multiple spaces
    content = content.replace(/className=" +/g, 'className="');
    content = content.replace(/className=' +/g, "className='");
    content = content.replace(/ +"/g, '"');
    content = content.replace(/ +'/g, "'");
    content = content.replace(/  +/g, ' ');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
