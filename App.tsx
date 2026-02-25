import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import Generator from './components/Generator';
import ChatWidget from './components/ChatWidget';
import { AppState } from './types';

const App: React.FC = () => {
  // Simple state-based routing for SPA
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar setAppState={setAppState} />
      
      <main className="flex-grow">
        {appState === AppState.LANDING ? (
          <>
            <Hero setAppState={setAppState} />
            <Features />
            <HowItWorks />
          </>
        ) : (
          <Generator />
        )}
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default App;