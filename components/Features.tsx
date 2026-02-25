import React from 'react';
import { Microscope, Globe, Terminal } from 'lucide-react';
import { CONTENT } from '../constants';

const Features: React.FC = () => {
  const { features_section } = CONTENT.website_content;

  const featuresData = [
    { icon: Microscope, color: "text-fuchsia-500", bg: "bg-fuchsia-50", border: "group-hover:border-fuchsia-200" },
    { icon: Globe, color: "text-cyan-500", bg: "bg-cyan-50", border: "group-hover:border-cyan-200" },
    { icon: Terminal, color: "text-violet-600", bg: "bg-violet-50", border: "group-hover:border-violet-200" }
  ];

  return (
    <section className="py-24 bg-white/50 backdrop-blur-sm relative z-10 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-3 gap-8">
          {features_section.map((feature, index) => {
            const Style = featuresData[index];
            const Icon = Style.icon;
            
            return (
              <div key={feature.id} className={`group p-10 rounded-3xl bg-white hover:bg-slate-50 border border-transparent ${Style.border} transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 relative overflow-hidden`}>
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${Style.bg} opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-2xl`}></div>
                
                <div className={`mb-8 inline-block p-4 rounded-2xl ${Style.bg} border border-slate-100 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <Icon className={`w-8 h-8 ${Style.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-display">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;