import fs from 'fs';

let filePath = './src/components/MooderiaGatekeeper.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /'Historical Timeline: Review your journey through Mooderia.',/g,
  "'Historical Timeline: Review your journey through <b>mooderia</b>.',"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed MooderiaGatekeeper.tsx');
