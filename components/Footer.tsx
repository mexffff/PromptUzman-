import React from 'react';
import { CONTENT } from '../constants';

const Footer: React.FC = () => {
  const { footer_slogan } = CONTENT.website_content;
  
  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-400 text-sm font-light">
          &copy; {new Date().getFullYear()} PromptUzmanı. All rights reserved.
        </div>
        <div className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 italic font-display">
          "{footer_slogan}"
        </div>
      </div>
    </footer>
  );
};

export default Footer;