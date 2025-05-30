import React from 'react';
import BotIllustration from './BotIllustration';
import { Info } from 'lucide-react'; // optional: use a better icon from lucide

interface WelcomePanelProps {
  onGetStarted: () => void;
  onAboutClick?: () => void; 
}

const WelcomePanel: React.FC<WelcomePanelProps> = ({ onGetStarted, onAboutClick }) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0c0920] to-[#131136] text-white p-12 animate-fadeIn relative">
      <button
        onClick={onAboutClick}
        title="About"
        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
      >
        <Info className="w-6 h-6" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto">
        <BotIllustration />
        
        <h1 className="text-5xl font-bold mb-6 text-center">
          Your <span className="text-cyan-400">Intelligent Chat</span><br />
          <span className="text-cyan-400">Companion</span>
        </h1>
        
        <p className="text-center text-gray-400 text-lg mb-12 max-w-xl">
          Instant answers, friendly conversation, and personalized assistance are just a click away with our advanced chatbot.
        </p>

        <button 
          onClick={onGetStarted}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full py-4 px-12 text-lg font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/20"
        >
          Get started
        </button>
      </div>
    </div>
  );
};

export default WelcomePanel;
