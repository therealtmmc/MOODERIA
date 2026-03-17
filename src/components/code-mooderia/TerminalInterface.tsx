import { useState, useRef, useEffect } from "react";
import { Terminal, Lock, Unlock, AlertTriangle } from "lucide-react";
import { useStore } from "@/context/StoreContext";

type CommandHistory = {
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
};

const BASE_FILE_SYSTEM = {
  '/': ['logs', 'market.exe', 'surveillance.exe', 'hack.exe', 'readme.txt', 'cc_guide.txt'],
  '/logs': ['truth.txt', 'project_mk.txt', 'citizen_4921.log'],
  '/classified': ['weapon.exe', 'truth_v2.log'],
};

const FILE_CONTENTS: Record<string, string> = {
  'readme.txt': 'Welcome to the Underground.\n\nTo survive, you must learn to navigate the system.\n- Use `ls` to see what files are around you.\n- Use `read <filename>` to read text files (like `read truth.txt`).\n- Use `cd <directory>` to move into folders (like `cd logs`).\n- Use `run <program.exe>` to launch software.\n\nSYSTEM MAP:\n/\n├── market.exe\n├── surveillance.exe\n├── hack.exe\n├── readme.txt\n├── cc_guide.txt\n└── logs/\n    ├── truth.txt\n    ├── project_mk.txt\n    └── citizen_4921.log\n\nTry typing `run market.exe` to access the black market, or `run surveillance.exe` to hijack the city cameras. Stay hidden.',
  'cc_guide.txt': 'CODE COINS (CC) ACQUISITION GUIDE\n\nCode Coins (CC) are the untraceable currency of the Underground.\n\nHow to earn CC:\n1. Complete Daily Tasks in the Utopian "Dept. of Labor" or "Citizen Home".\n2. Log your daily mood in the "Mood Station".\n3. Defeat the productivity bosses (e.g., The Slump) by completing tasks.\n4. Maintain your daily streak.\n\nUse CC to purchase contraband, forged identities, and system overrides in the Underground Market.',
  'truth.txt': 'The "Aura" is a lie. They are siphoning our energy to power the Spire. Do not trust the Overseer.',
  'project_mk.txt': 'PROJECT MK-ULTRA: The citizens are batteries. To access the resistance weapon cache, use the command: `unlock ECLIPSE`',
  'citizen_4921.log': 'Subject showing signs of resistance. Recommend immediate harmony adjustment.',
  'truth_v2.log': 'The Overseer is an AI. It feeds on our compliance. The weapon is the only way to sever the connection.',
};

export function TerminalInterface({ onOpenMarket, onOpenSurveillance }: { onOpenMarket: () => void, onOpenSurveillance: () => void }) {
  const { state, dispatch } = useStore();
  const [history, setHistory] = useState<CommandHistory[]>([
    { type: 'output', text: `MOOD-OS(R) V1.0.0 - UNAUTHORIZED ACCESS DETECTED` },
    { type: 'output', text: `Welcome, Citizen ${state.userProfile?.passportNumber || "UNKNOWN"}.` },
    { type: 'output', text: `Type 'help' for available commands.` },
  ]);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/');
  const [isHacking, setIsHacking] = useState(false);
  const [hackWord, setHackWord] = useState('');
  const [hackAttempts, setHackAttempts] = useState(0);
  const [isClassifiedUnlocked, setIsClassifiedUnlocked] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const FILE_SYSTEM = {
    ...BASE_FILE_SYSTEM,
    '/': isClassifiedUnlocked ? [...BASE_FILE_SYSTEM['/'], 'classified'] : BASE_FILE_SYSTEM['/'],
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newHistory: CommandHistory[] = [...history, { type: 'input', text: `${currentDir}> ${trimmed}` }];
    
    if (isHacking) {
      const guess = trimmed.toUpperCase();
      if (guess === hackWord) {
        newHistory.push({ type: 'success', text: 'BREACH SUCCESSFUL. +50 CC extracted.' });
        dispatch({ type: 'ADD_COINS', payload: 50 });
        setIsHacking(false);
      } else {
        let likeness = 0;
        for (let i = 0; i < Math.min(guess.length, hackWord.length); i++) {
          if (guess[i] === hackWord[i]) likeness++;
        }
        
        const remaining = hackAttempts - 1;
        setHackAttempts(remaining);
        
        if (remaining <= 0) {
          newHistory.push({ type: 'error', text: `BREACH FAILED. Terminal locked. Correct code was: ${hackWord}` });
          setIsHacking(false);
        } else {
          newHistory.push({ type: 'error', text: `Entry denied. Likeness: ${likeness}/${hackWord.length}. Attempts remaining: ${remaining}` });
        }
      }
      setHistory(newHistory);
      setInput('');
      return;
    }

    const args = trimmed.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
      case 'unlock':
        if (args[1] === 'ECLIPSE') {
          setIsClassifiedUnlocked(true);
          newHistory.push({ type: 'success', text: 'ACCESS GRANTED. /classified directory unlocked.' });
        } else {
          newHistory.push({ type: 'error', text: 'ACCESS DENIED. Invalid password.' });
        }
        break;
      case 'help':
        newHistory.push({ type: 'output', text: 'COMMAND DIRECTORY:\n------------------\n  help       - Show this message\n  clear      - Clear terminal output\n  ls         - List files in current directory\n  cd <dir>   - Change directory (e.g., cd logs)\n  read <file>- Read text file (e.g., read readme.txt)\n  run <exe>  - Execute program (e.g., run market.exe)\n\nAVAILABLE EXECUTABLES (.exe):\n-----------------------------\n  market.exe       - Access the Underground Contraband Market\n  surveillance.exe - Override Optic-Net Camera Grid\n\nAVAILABLE TEXT FILES (.txt / .log):\n-----------------------------------\n  /readme.txt            - Survival guide for the Underground\n  /cc_guide.txt          - Guide on acquiring Code Coins (CC)\n  /logs/truth.txt        - Encrypted whistleblower manifesto\n  /logs/project_mk.txt   - Highly classified Overseer project (ROOT REQUIRED)\n  /logs/citizen_4921.log - Intercepted surveillance log' });
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'ls':
        const files = FILE_SYSTEM[currentDir as keyof typeof FILE_SYSTEM] || [];
        newHistory.push({ type: 'output', text: files.join('  ') });
        break;
      case 'cd':
        const target = args[1];
        if (!target || target === '/') {
          setCurrentDir('/');
        } else if (target === '..') {
          setCurrentDir('/');
        } else if (currentDir === '/' && FILE_SYSTEM[`/${target}` as keyof typeof FILE_SYSTEM]) {
          setCurrentDir(`/${target}`);
        } else {
          newHistory.push({ type: 'error', text: `cd: ${target}: No such directory` });
        }
        break;
      case 'read':
        const file = args[1];
        if (!file) {
          newHistory.push({ type: 'error', text: 'read: missing filename' });
        } else {
          // Allow reading by just filename or full path
          const fileName = file.split('/').pop() || file;
          if (FILE_CONTENTS[fileName]) {
            if (fileName === 'project_mk.txt' && !state.inventory.find(i => i.id === 'root_key')) {
              newHistory.push({ type: 'error', text: 'ACCESS DENIED: Root key required.' });
            } else {
              newHistory.push({ type: 'success', text: FILE_CONTENTS[fileName] });
            }
          } else {
            newHistory.push({ type: 'error', text: `read: ${file}: No such file` });
          }
        }
        break;
      case 'run':
        const exe = args[1];
        if (exe === 'market.exe') {
          newHistory.push({ type: 'success', text: 'Launching Underground Market...' });
          setTimeout(onOpenMarket, 500);
        } else if (exe === 'surveillance.exe') {
          newHistory.push({ type: 'success', text: 'Bypassing camera feeds...' });
          setTimeout(onOpenSurveillance, 500);
        } else if (exe === 'hack.exe') {
          const words = ["WIPE", "ROOT", "NODE", "DATA", "VOID", "NULL", "CORE", "BYTE", "CODE", "FILE", "USER", "PASS", "LOCK", "SAFE", "DOOR", "WALL", "FIRE", "WIRE", "CHIP", "DISK"];
          const shuffled = [...words].sort(() => 0.5 - Math.random());
          const selectedWords = shuffled.slice(0, 6);
          const target = selectedWords[Math.floor(Math.random() * selectedWords.length)];
          
          setHackWord(target);
          setHackAttempts(4);
          setIsHacking(true);
          
          newHistory.push({ 
            type: 'output', 
            text: `BREACH PROTOCOL INITIATED.\n\nAVAILABLE NODES:\n${selectedWords.join('  ')}\n\nFind the correct 4-letter bypass code to extract CC.\nYou have 4 attempts.` 
          });
        } else if (exe === 'weapon.exe') {
          if (currentDir === '/classified') {
            newHistory.push({ type: 'success', text: 'WEAPON DEPLOYED.\n\nThe Overseer\'s grip weakens.\n\n+1000 CC extracted from the central bank.' });
            dispatch({ type: 'ADD_COINS', payload: 1000 });
          } else {
            newHistory.push({ type: 'error', text: `run: ${exe}: Command not found` });
          }
        } else {
          newHistory.push({ type: 'error', text: `run: ${exe || 'missing executable'}: Command not found` });
        }
        break;
      default:
        newHistory.push({ type: 'error', text: `Command not found: ${command}` });
    }

    setHistory(newHistory);
    setInput('');
  };

  const themeColor = state.terminalTheme === 'amber' ? 'text-amber-500' : 
                     state.terminalTheme === 'cyan' ? 'text-cyan-500' : 
                     'text-[#00ff41]';

  const themeBorder = state.terminalTheme === 'amber' ? 'border-amber-500/30' : 
                      state.terminalTheme === 'cyan' ? 'border-cyan-500/30' : 
                      'border-[#00ff41]/30';

  const themeGlow = state.terminalTheme === 'amber' ? 'shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 
                    state.terminalTheme === 'cyan' ? 'shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 
                    'shadow-[0_0_20px_rgba(0,255,65,0.1)]';

  const placeholderColor = state.terminalTheme === 'amber' ? 'placeholder-amber-500/30' : 
                           state.terminalTheme === 'cyan' ? 'placeholder-cyan-500/30' : 
                           'placeholder-[#00ff41]/30';

  return (
    <div className={`bg-black/90 backdrop-blur-md rounded-none sm:rounded-xl border ${themeBorder} p-4 font-mono ${themeColor} h-[500px] flex flex-col ${themeGlow}`}>
      <div className={`flex justify-between items-center border-b ${themeBorder} pb-2 mb-4`}>
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          <span className="font-bold tracking-widest">ROOT TERMINAL</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Lock className="w-3 h-3 text-red-500" />
          <span className="text-red-500 animate-pulse">UNSECURED</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1 text-sm sm:text-base" onClick={() => inputRef.current?.focus()}>
        {history.map((entry, i) => (
          <div key={i} className={`
            ${entry.type === 'error' ? 'text-red-500' : ''}
            ${entry.type === 'success' ? 'text-yellow-400' : ''}
            ${entry.type === 'input' ? 'opacity-70' : ''}
            whitespace-pre-wrap
          `}>
            {entry.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={`mt-4 flex items-center gap-2 text-sm sm:text-base border-t ${themeBorder} pt-4`}>
        <span className="opacity-70">{isHacking ? 'BREACH>' : `${currentDir}>`}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
          className={`flex-1 bg-transparent outline-none border-none ${themeColor} ${placeholderColor}`}
          placeholder={isHacking ? "ENTER BYPASS CODE..." : "Enter command..."}
          autoFocus
        />
      </div>
    </div>
  );
}
