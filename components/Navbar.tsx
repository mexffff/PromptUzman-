import React from 'react';
import { Sparkles } from 'lucide-react';
import { AppState } from '../types';

interface NavbarProps {
  setAppState: (state: AppState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setAppState }) => {
  return (
    <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto relative z-50">
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => setAppState(AppState.LANDING)}
      >
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-300">
          <Sparkles size={22} className="animate-pulse" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-slate-800 group-hover:text-violet-600 transition-colors">PromptUzmanı</span>
      </div>
      <div>
        <button 
          onClick={() => setAppState(AppState.GENERATOR)}
          className="px-5 py-2 rounded-full text-sm font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-all hover:shadow-md"
        >
          Uygulamaya Git
        </button>
      </div>
    </nav>
  );
};

export default Navbar;