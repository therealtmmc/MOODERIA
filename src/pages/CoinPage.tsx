import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CoinPage() {
  const navigate = useNavigate();
  
  // The URL to the Mooderia Coin GitHub Pages site
  const githubPagesUrl = "https://therealtmmc.github.io/Mooderia-Coin/"; 

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      <div className="flex items-center p-4 border-b border-gray-100 bg-white shadow-sm z-10">
        <button 
          onClick={() => navigate('/')}
          className="p-2 mr-4 bg-gray-50 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="font-black text-xl text-gray-900">Mooderia Coin</h1>
      </div>
      
      <iframe 
        src={githubPagesUrl} 
        className="w-full flex-1 border-none bg-gray-50"
        title="Mooderia Coin"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
