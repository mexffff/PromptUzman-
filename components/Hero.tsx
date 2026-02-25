import React from 'react';
import { ArrowRight, Zap, Search, Cpu } from 'lucide-react';
import { CONTENT } from '../constants';
import { AppState } from '../types';

interface HeroProps {
  setAppState: (state: AppState) => void;
}

const Hero: React.FC<HeroProps> = ({ setAppState }) => {
  const { hero_section } = CONTENT.website_content;

  return (
    <section className="relative pt-20 pb-32 flex flex-col items-center text-center px-6 overflow-hidden">
      {/* Colorful Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="z-10 max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-violet-100 text-violet-700 text-xs font-bold tracking-wide uppercase mb-4 shadow-sm">
          <Zap size={14} className="text-amber-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">Gemini 3.0 Pro & Flash 2.5 Gücüyle</span>
        </div>
        
        <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
          Sadece Fikrini Yaz, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 animate-gradient">Gerisini Bize Bırak</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
          {hero_section.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button 
            onClick={() => setAppState(AppState.GENERATOR)}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl text-lg font-semibold hover:shadow-2xl hover:shadow-violet-500/40 transition-all hover:-translate-y-1"
          >
            {hero_section.button_text}
            <ArrowRight className="group-hover:translate-x-1 transition-transform text-white/80" />
          </button>
        </div>
      </div>
      
      {/* Floating Icons / Tech Stack */}
      <div className="mt-28 flex gap-12 opacity-60 hover:opacity-100 transition-opacity duration-500">
        <div className="flex flex-col items-center gap-3 group">
            <div className="p-4 bg-white rounded-2xl shadow-lg shadow-amber-100 group-hover:scale-110 transition-transform">
              <Zap className="text-amber-500" size={32} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Flash Lite</span>
        </div>
        <div className="flex flex-col items-center gap-3 group">
            <div className="p-4 bg-white rounded-2xl shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
              <Search className="text-blue-500" size={32} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Grounding</span>
        </div>
        <div className="flex flex-col items-center gap-3 group">
             <div className="p-4 bg-white rounded-2xl shadow-lg shadow-violet-100 group-hover:scale-110 transition-transform">
               <Cpu className="text-violet-600" size={32} />
             </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Gemini 3 Pro</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;