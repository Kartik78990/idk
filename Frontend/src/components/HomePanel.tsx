import React, { useState } from "react";
import {
  BookOpen,
  ShoppingBag,
  Pencil,
  Award,
  Search,
  Home,
  User,
  MessageSquare,
  Menu,
  Mic,
} from "lucide-react";
import ExploreCard from "./ExploreCard";
import CategoryButton from "./CategoryButton";
import VoiceChatInput from "./VoiceChatPanel";

interface Persona {
  name: string;
  prompt: string;
}

interface HomePanelProps {
  onChatOpen: (persona?: Persona) => void;
  onProfileOpen: () => void;
  onExploreOpen: () => void;
  onLibraryOpen: () => void;
  onOpenVoiceChat?: () => void;
}

const HomePanel: React.FC<HomePanelProps> = ({
  onChatOpen,
  onProfileOpen,
  onExploreOpen,
  onLibraryOpen,
  onOpenVoiceChat,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [voiceChatOpen, setVoiceChatOpen] = useState(false);

  const handleVoiceChatSend = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "voice.webm");

    try {
      const res = await fetch("http://localhost:8000/voice-chat", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const message = data.response || "No response";

      onChatOpen({
        name: "Voice Assistant",
        prompt: `You're a voice assistant. The user said: "${message}"`,
      });

      setVoiceChatOpen(false); // close voice chat panel
    } catch (error) {
      console.error("Error sending audio:", error);
      // optionally show error UI
    }
  };

  const personalities: Record<string, Persona> = {
    article: {
      name: "Lexi the Writer",
      prompt:
        "You're Lexi, a helpful and creative writer. Help users write insightful articles and blogs.",
    },
    marketing: {
      name: "Mark the Marketer",
      prompt:
        "You're Mark, a witty AI who crafts catchy and effective marketing content.",
    },
    ecommerce: {
      name: "Ella the Seller",
      prompt:
        "You're Ella, an e-commerce expert who writes persuasive product descriptions that convert.",
    },
    writing: {
      name: "Sage the Storyteller",
      prompt:
        "You're Sage, a calm, imaginative assistant that helps users write compelling stories.",
    },
  };

  const handleCardClick = (type: keyof typeof personalities) => {
    onChatOpen(personalities[type]);
  };

  const Sidebar = (
    <div className="w-72 bg-[#0c0920] text-white h-full flex flex-col p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
          <span className="text-white font-medium text-lg">KP</span>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Welcome back,</p>
          <h2 className="font-semibold text-lg">Kartik Pundir</h2>
        </div>
      </div>

      <nav className="space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1a1a2e] text-white">
          <Home size={20} />
          <span>Home</span>
        </button>
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            onExploreOpen();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#1a1a2e] hover:text-white transition-colors"
        >
          <Search size={20} />
          <span>Explore</span>
        </button>
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            onLibraryOpen();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#1a1a2e] hover:text-white transition-colors"
        >
          <BookOpen size={20} />
          <span>Library</span>
        </button>
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            onProfileOpen();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#1a1a2e] hover:text-white transition-colors"
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>

      <div className="mt-auto bg-[#1e3a8a] rounded-xl p-6 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-blue-400/20 blur-xl"></div>
        <h3 className="font-semibold text-lg mb-2">Premium Chat</h3>
        <p className="text-blue-200 mb-4 text-sm">
          Unlock your AI chatbot & get all premium features!
        </p>
        <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-6 rounded-full transition-all text-sm">
          Upgrade plan
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-[#0c0920] text-white relative">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform bg-[#0c0920] w-72 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0`}
      >
        {Sidebar}
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Top Bar for Mobile */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-white"
          >
            <Menu size={28} />
          </button>
          <h1 className="text-xl font-semibold">Explore</h1>
          <div className="w-8" />
        </div>

        {/* Main Content */}
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-6 hidden md:block">Explore</h1>

          <div className="flex gap-3 mb-6 flex-wrap">
            <CategoryButton label="All Type" isActive />
            <CategoryButton label="Image" />
            <CategoryButton label="Video" />
            <CategoryButton label="Writing" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <ExploreCard
              icon={BookOpen}
              title="Article & Blogs"
              description="Detailed articles with helpful tips to write better content."
              color="bg-orange-500"
              onClick={() => handleCardClick("article")}
            />
            <ExploreCard
              icon={Award}
              title="Marketing"
              description="Creating ads with unique and appealing titles that work."
              color="bg-blue-500"
              onClick={() => handleCardClick("marketing")}
            />
            <ExploreCard
              icon={ShoppingBag}
              title="Ecommerce"
              description="Authentic product descriptions that sell."
              color="bg-purple-500"
              onClick={() => handleCardClick("ecommerce")}
            />
            <ExploreCard
              icon={Pencil}
              title="Writing"
              description="Build a compelling story from scratch with AI."
              color="bg-green-500"
              onClick={() => handleCardClick("writing")}
            />
          </div>
        </div>

        {/* Buttons container: mic and new chat side-by-side */}
        <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 flex items-center gap-4 z-20">
          {/* Voice Chat Button */}
          <button
            onClick={() => onOpenVoiceChat && onOpenVoiceChat()}
            className="bg-pink-600 p-4 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
            title="Voice Chat"
          >
            <Mic size={24} />
          </button>

          {/* New Chat Button */}
          <button
            onClick={() => onChatOpen()}
            className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 rounded-full flex items-center gap-3 text-white font-medium shadow-lg shadow-purple-900/30 hover:shadow-purple-700/40 transition-all transform hover:scale-105 active:scale-95"
          >
            <MessageSquare size={24} />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>

        {/* Voice Chat Input Panel */}
        {voiceChatOpen && (
          <VoiceChatInput
            onBackClick={() => setVoiceChatOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HomePanel;
