import React, { useState, useEffect } from 'react';
import { Send, Loader2, Copy, CheckCircle, Search, Zap, BrainCircuit, Save, Bookmark, Trash2, Clock, ArrowLeft, RefreshCw, Wand2, Layers, Sparkles, Check, Lightbulb } from 'lucide-react';
import { analyzeIdeaFast, researchTopic, generateSuperPrompt, refinePrompt } from '../services/geminiService';
import { ResearchSource, AnalysisResult, SavedPrompt } from '../types';

// Toast Notification Component
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 right-6 z-50 animate-fade-in">
      <div className="bg-slate-800 text-white px-6 py-4 rounded-xl shadow-2xl shadow-violet-500/20 flex items-center gap-4 border border-slate-700/50">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-1">
          <Check size={12} className="text-white" />
        </div>
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  );
};

const Generator: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'researching' | 'generating' | 'done'>('idle');
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [researchSources, setResearchSources] = useState<ResearchSource[]>([]);
  const [superPrompt, setSuperPrompt] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Local Storage State
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  // Load prompts on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedPrompts');
    if (saved) {
      try {
        setSavedPrompts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved prompts", e);
      }
    }
  }, []);

  const savePromptAutomatically = (text: string, userIdea: string) => {
    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      idea: userIdea.length > 60 ? userIdea.substring(0, 60) + "..." : userIdea || "Otomatik Kayıt",
      text: text,
      timestamp: Date.now()
    };

    const updated = [newPrompt, ...savedPrompts];
    setSavedPrompts(updated);
    localStorage.setItem('savedPrompts', JSON.stringify(updated));
    setToastMsg("Otomatik kaydedildi!");
  };

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    
    setIsProcessing(true);
    setAnalysisResult(null);
    setResearchSources([]);
    setSuperPrompt(null);
    setShowSaved(false); 

    // Step 1: Fast Analysis
    setStatus('analyzing');
    const analysis = await analyzeIdeaFast(idea);
    setAnalysisResult(analysis);

    // Step 2: Research
    setStatus('researching');
    const research = await researchTopic(idea);
    setResearchSources(research.sources);

    // Step 3: Generation
    setStatus('generating');
    const result = await generateSuperPrompt(idea, research.text);
    setSuperPrompt(result);
    
    // Auto Save
    savePromptAutomatically(result, idea);

    setStatus('done');
    setIsProcessing(false);
  };

  const handleRefine = async (type: string, label: string) => {
    if (!superPrompt || !idea) return;
    
    setIsRefining(true);
    
    const refinedResult = await refinePrompt(idea, superPrompt, type);
    setSuperPrompt(refinedResult);
    
    // Auto Save Refined Version
    savePromptAutomatically(refinedResult, `${idea} (${label})`);
    
    setIsRefining(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Bu promptu silmek istediğinize emin misiniz?")) {
      const updated = savedPrompts.filter(p => p.id !== id);
      setSavedPrompts(updated);
      localStorage.setItem('savedPrompts', JSON.stringify(updated));
      setToastMsg("Prompt silindi.");
    }
  };

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setToastMsg("Kopyalandı!");
    }
  };

  const loadFromHistory = (prompt: SavedPrompt) => {
    setIdea(prompt.idea); 
    setSuperPrompt(prompt.text);
    setStatus('done');
    setShowSaved(false);
  };

  // Progress Stepper Component
  const ProgressStep = ({ active, completed, label, icon: Icon, colorClass }: any) => (
    <div className={`relative flex flex-col items-center z-10 transition-all duration-500 ${active || completed ? 'opacity-100 scale-105' : 'opacity-40 scale-95'}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 
        ${completed ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white' : active ? `bg-white text-white ring-4 ring-${colorClass.split('-')[1]}-100 relative` : 'bg-white text-slate-300 border border-slate-200'}`}>
        {completed ? <Check size={24} /> : <Icon size={24} className={active ? `text-${colorClass.split('-')[1]}-500 animate-pulse` : ''} />}
      </div>
      <span className={`mt-3 text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${active || completed ? 'text-slate-800' : 'text-slate-300'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 min-h-screen font-sans">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight font-display">
            Prompt Oluşturucu
            <span className="px-2.5 py-0.5 bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-violet-200">Pro v2.0</span>
          </h2>
          <p className="text-slate-500 text-lg font-light">Profesyonel prompt mühendisliği artık otomatik.</p>
        </div>
        <button 
          onClick={() => setShowSaved(!showSaved)}
          className="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 hover:border-violet-300 rounded-xl text-slate-700 font-medium transition-all shadow-sm hover:shadow-violet-100 hover:text-violet-700"
        >
          {showSaved ? (
            <>
              <ArrowLeft size={18} className="text-slate-800 group-hover:text-violet-700 group-hover:-translate-x-1 transition-transform" />
              <span>Oluşturucuya Dön</span>
            </>
          ) : (
            <>
              <div className="relative">
                <Bookmark size={18} className="text-slate-800 group-hover:text-violet-700 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-fuchsia-500 rounded-full border-2 border-white"></span>
              </div>
              <span>Kütüphanem ({savedPrompts.length})</span>
            </>
          )}
        </button>
      </div>

      {showSaved ? (
        /* --- LIBRARY VIEW --- */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {savedPrompts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white/50 rounded-3xl border border-dashed border-slate-200 text-center backdrop-blur-sm">
              <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Bookmark size={32} className="text-violet-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2 font-display">Kütüphaneniz Boş</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Henüz hiç süper prompt oluşturmadınız.</p>
              <button 
                onClick={() => setShowSaved(false)}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all"
              >
                Hemen Oluştur
              </button>
            </div>
          ) : (
            savedPrompts.map(prompt => (
              <div 
                key={prompt.id} 
                className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-violet-300 transition-all duration-300 cursor-pointer relative shadow-sm hover:shadow-xl hover:shadow-violet-100/50"
                onClick={() => loadFromHistory(prompt)}
              >
                <div className="flex justify-between items-start mb-4 pl-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-violet-700 transition-colors">{prompt.idea}</h3>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mt-2">
                      <Clock size={12} />
                      {new Date(prompt.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(prompt.id, e)}
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                    title="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4 h-32 overflow-hidden relative group-hover:bg-violet-50/30 transition-colors">
                  <pre className="font-mono text-xs text-slate-600 whitespace-pre-wrap opacity-80">{prompt.text}</pre>
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-50 to-transparent group-hover:from-white"></div>
                </div>
                
                <div className="flex justify-between items-center pl-1">
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider bg-violet-50 px-2 py-1 rounded">Otomatik Kayıtlı</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(prompt.text); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-violet-600 hover:text-white rounded-lg transition-colors"
                  >
                    <Copy size={14} />
                    Kopyala
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* --- GENERATOR VIEW --- */
        <div className="animate-fade-in">
          
          {/* Input Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden mb-12 relative group">
             {/* Focus Border Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 p-[2px] opacity-0 transition-opacity duration-500 rounded-3xl ${isProcessing ? 'opacity-100 animate-gradient' : 'group-focus-within:opacity-100'}`}></div>

            <div className="bg-white relative z-10 rounded-[22px] h-full">
              <div className="p-8 md:p-10">
                <textarea
                  className="w-full h-40 bg-transparent border-none focus:ring-0 outline-none resize-none text-2xl text-slate-800 placeholder:text-slate-300 leading-relaxed font-light"
                  placeholder="Aklınızdaki proje veya fikri buraya yazın..."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  disabled={isProcessing || isRefining}
                ></textarea>
                
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-8 border-t border-slate-100 gap-6">
                   <div className="flex gap-6 text-slate-400 text-xs font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-amber-500" />
                        <span>Hızlı Analiz</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Search size={16} className="text-blue-500" />
                        <span>Canlı Araştırma</span>
                      </div>
                   </div>

                   <button
                    onClick={handleGenerate}
                    disabled={isProcessing || !idea.trim() || isRefining}
                    className={`relative overflow-hidden flex items-center gap-3 px-10 py-4 rounded-xl font-medium text-white transition-all transform ${
                      isProcessing || !idea.trim() || isRefining
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-600/30 hover:scale-[1.02]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        İşleniyor
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} className={idea.trim() ? "text-fuchsia-300" : "text-slate-300"} />
                        Süper Prompt Oluştur
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps Visualization */}
          {(isProcessing || status !== 'idle') && (
            <div className="mb-16 relative px-4 max-w-3xl mx-auto">
              {/* Connecting Line */}
              <div className="absolute top-7 left-12 right-12 h-1 bg-slate-100 rounded-full -z-10 overflow-hidden">
                 <div 
                    className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 transition-all duration-1000 ease-out"
                    style={{ 
                      width: status === 'analyzing' ? '33%' : status === 'researching' ? '66%' : status === 'done' || status === 'generating' ? '100%' : '0%' 
                    }}
                 ></div>
              </div>

              <div className="flex justify-between">
                <ProgressStep 
                  active={status === 'analyzing'} 
                  completed={['researching', 'generating', 'done'].includes(status)} 
                  label="Analiz" 
                  icon={BrainCircuit}
                  colorClass="text-amber-500"
                />
                <ProgressStep 
                  active={status === 'researching'} 
                  completed={['generating', 'done'].includes(status)} 
                  label="Araştırma" 
                  icon={Search}
                  colorClass="text-blue-500" 
                />
                <ProgressStep 
                  active={status === 'generating'} 
                  completed={status === 'done'} 
                  label="Üretim" 
                  icon={Wand2}
                  colorClass="text-fuchsia-500"
                />
              </div>
            </div>
          )}

          {/* Analysis & Research Grid */}
          {status === 'done' && (
             <div className="grid md:grid-cols-2 gap-8 mb-10 animate-fade-in">
                {/* Analysis Card */}
                {analysisResult && (
                  <div className="bg-white p-8 rounded-3xl border border-amber-100/50 shadow-lg shadow-amber-100/20 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                     
                     <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                           <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                              <Lightbulb size={20} />
                           </div>
                           <span className="font-bold text-slate-800 text-lg">Fikir Analizi</span>
                        </div>
                        <div className="px-4 py-1.5 bg-amber-100 text-amber-800 text-sm font-bold rounded-full border border-amber-200">
                           Skor: {analysisResult.score}
                        </div>
                     </div>
                     <div className="space-y-4 relative z-10">
                        {analysisResult.suggestions.map((s, i) => {
                           const parts = s.split('için şunu deneyin:');
                           return (
                             <div key={i} className="flex gap-4 text-sm text-slate-600 leading-relaxed p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-100/50 shadow-sm">
                               <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 shadow-sm shadow-amber-300"></div>
                               <span>
                                 {parts.length > 1 ? (
                                   <>
                                     <span className="block text-xs font-bold text-amber-700 uppercase mb-1.5">{parts[0].replace('Daha iyi bir ', '').trim()}</span>
                                     {parts[1]}
                                   </>
                                 ) : s}
                               </span>
                             </div>
                           );
                        })}
                     </div>
                  </div>
                )}

                {/* Research Card */}
                <div className="bg-white p-8 rounded-3xl border border-blue-100/50 shadow-lg shadow-blue-100/20 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                   
                   <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                         <Search size={20} />
                      </div>
                      <span className="font-bold text-slate-800 text-lg">Kullanılan Kaynaklar</span>
                   </div>
                   {researchSources.length > 0 ? (
                     <div className="flex flex-col gap-3 relative z-10">
                        {researchSources.slice(0, 3).map((src, idx) => (
                          <a 
                            key={idx} 
                            href={src.uri} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="group flex items-center gap-4 p-4 rounded-xl bg-white/80 hover:bg-blue-50 transition-colors border border-blue-100/50 hover:border-blue-200 shadow-sm"
                          >
                             <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                               {idx + 1}
                             </div>
                             <span className="text-sm text-slate-600 font-medium truncate group-hover:text-blue-700">{src.title}</span>
                             <ArrowLeft size={14} className="rotate-180 ml-auto text-slate-300 group-hover:text-blue-400" />
                          </a>
                        ))}
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm relative z-10">
                        <Search size={24} className="mb-3 opacity-20" />
                        Ekstra kaynak gerekmedi.
                     </div>
                   )}
                </div>
             </div>
          )}

          {/* Result Area */}
          {superPrompt && (
            <div className="animate-fade-in space-y-12 pb-24">
              <div className="bg-[#0f172a] rounded-2xl shadow-2xl shadow-violet-900/20 overflow-hidden ring-1 ring-white/10 relative group">
                {/* Glowing border effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl opacity-20 blur transition-opacity group-hover:opacity-40"></div>
                
                {/* Terminal Header */}
                <div className="relative bg-[#1e293b] px-6 py-4 flex justify-between items-center border-b border-slate-700/50">
                   <div className="flex items-center gap-2">
                     <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                       <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                       <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                     </div>
                     <span className="ml-4 text-xs font-mono text-slate-400 flex items-center gap-2 opacity-80">
                       <BrainCircuit size={12} className="text-violet-400" />
                       gemini-3-output.md
                     </span>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold tracking-wider text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded">
                        <Check size={10} /> KAYDEDİLDİ
                      </span>
                      <button 
                        onClick={() => copyToClipboard(superPrompt)}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-full transition-all shadow-lg shadow-violet-900/50"
                      >
                        <Copy size={12} />
                        KOPYALA
                      </button>
                   </div>
                </div>
                
                {/* Content */}
                <div className="relative p-10 overflow-x-auto custom-scrollbar bg-[#0f172a]">
                   {isRefining ? (
                     <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-6">
                        <div className="relative">
                           <div className="absolute inset-0 bg-violet-500 blur-xl opacity-20 animate-pulse"></div>
                           <Loader2 size={40} className="animate-spin text-violet-500 relative z-10" />
                        </div>
                        <p className="font-medium tracking-widest text-sm uppercase text-violet-300">Prompt Yeniden Şekillendiriliyor...</p>
                     </div>
                   ) : (
                     <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed selection:bg-violet-500/30 selection:text-white">
                       {superPrompt}
                     </pre>
                   )}
                </div>
              </div>

              {/* Refinement Options */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/40">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 text-slate-900 mb-2">
                           <Wand2 size={22} className="text-fuchsia-500" />
                           <h4 className="font-bold text-2xl font-display">Sonucu Beğenmedin mi?</h4>
                        </div>
                        <p className="text-slate-500">Yapay zeka farklı bir düşünce yapısıyla promptu sıfırdan tekrar yazsın.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <button
                       onClick={() => handleRefine("Different Perspective, more creative, unconventional approach", "Kreatif")}
                       disabled={isRefining}
                       className="group relative p-6 bg-slate-50 hover:bg-white border border-slate-200 hover:border-fuchsia-300 rounded-2xl text-left transition-all hover:shadow-lg hover:shadow-fuchsia-100"
                     >
                        <div className="mb-3 w-10 h-10 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-600 group-hover:scale-110 transition-transform">
                          <Sparkles size={20} />
                        </div>
                        <span className="block font-bold text-slate-800 mb-1">Kreatif Bakış</span>
                        <span className="text-xs text-slate-500 leading-relaxed">Daha yaratıcı ve sıra dışı bir versiyon.</span>
                     </button>
                     
                     <button
                       onClick={() => handleRefine("Focus on technical details, constraints, step-by-step execution", "Teknik")}
                       disabled={isRefining}
                       className="group relative p-6 bg-slate-50 hover:bg-white border border-slate-200 hover:border-violet-300 rounded-2xl text-left transition-all hover:shadow-lg hover:shadow-violet-100"
                     >
                        <div className="mb-3 w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
                           <Layers size={20} />
                        </div>
                        <span className="block font-bold text-slate-800 mb-1">Teknik Detay</span>
                        <span className="text-xs text-slate-500 leading-relaxed">Adım adım plan ve teknik kısıtlamalar.</span>
                     </button>
                     
                     <button
                       onClick={() => handleRefine("Simplify, concise, direct, focus on core value", "Sade")}
                       disabled={isRefining}
                       className="group relative p-6 bg-slate-50 hover:bg-white border border-slate-200 hover:border-cyan-300 rounded-2xl text-left transition-all hover:shadow-lg hover:shadow-cyan-100"
                     >
                        <div className="mb-3 w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                           <Zap size={20} />
                        </div>
                        <span className="block font-bold text-slate-800 mb-1">Sadeleştir</span>
                        <span className="text-xs text-slate-500 leading-relaxed">Gereksiz detaylardan arınmış net sonuç.</span>
                     </button>
                  </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Generator;