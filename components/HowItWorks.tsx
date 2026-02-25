import React from 'react';
import { CONTENT } from '../constants';

const HowItWorks: React.FC = () => {
  const { how_it_works } = CONTENT.website_content;

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-violet-100/50 to-transparent rounded-full blur-3xl -z-10 opacity-60"></div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight font-display mb-4">Nasıl Çalışır?</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full mx-auto"></div>
        </div>
        
        <div className="space-y-16 relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-violet-200 via-fuchsia-200 to-transparent hidden md:block"></div>

          {[how_it_works.step_1, how_it_works.step_2, how_it_works.step_3].map((step, idx) => (
            <div key={idx} className="flex gap-8 items-start relative group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-4 border-violet-50 text-violet-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-violet-100 z-10 group-hover:scale-110 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-violet-100">
                {idx + 1}
              </div>
              <div className="pt-1 p-6 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-transparent hover:border-slate-100 w-full">
                <h3 className="text-xl font-bold text-slate-800 mb-3 font-display">
                  {idx === 0 && "Fikrini Gir"}
                  {idx === 1 && "Yapay Zeka Analizi"}
                  {idx === 2 && "Sonuç"}
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed font-light">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;