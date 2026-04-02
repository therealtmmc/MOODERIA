import fs from 'fs';

let filePath = './src/components/Header.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /state\.isStarkTheme \?"text-green-400 font-mono tracking-widest stark-theme-glitch ml-1" :"tracking-tighter text-\[#46178f\]"/g,
  'state.isStarkTheme ?"text-[#879E2A] font-mono tracking-widest stark-theme-glitch ml-1 uppercase" :"tracking-tighter text-[#46178f] lowercase"'
);

content = content.replace(
  /\{state\.isStarkTheme \?"CODE MOODERIA" :"Mooderia"\}/g,
  '{state.isStarkTheme ?"CODE MOODERIA" :"mooderia"}'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Header.tsx');
