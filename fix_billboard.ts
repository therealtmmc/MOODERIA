import fs from 'fs';

let filePath = './src/components/Billboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /"Welcome to Mooderia!",/g,
  '"Welcome to mooderia!",'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Billboard.tsx');
