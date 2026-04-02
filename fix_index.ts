import fs from 'fs';

let filePath = './src/index.css';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /\.stark-theme \.bg-white,/g,
  '.stark-theme .bg-white,\n.stark-theme .bg-black,\n.stark-theme .bg-black\\/90,'
);

content = content.replace(
  /\.stark-theme \.text-white \{/g,
  '.stark-theme .text-white,\n.stark-theme .text-green-400,\n.stark-theme .text-green-500,\n.stark-theme .text-green-600\\/70 {'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed index.css');
