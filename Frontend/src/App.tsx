// src/App.tsx
import React, { useState } from "react";
import WelcomePanel from "./components/WelcomePanel";
import HomePanel from "./components/HomePanel";
import ChatPanel from "./components/ChatPanel";
import ChatPanelWithPersona from "./components/ChatPanelWithPersona";
import ProfilePanel from "./components/ProfilePanel";
import ExplorePanel from "./components/ExplorePanel";
import LibraryPanel from "./components/LibraryPanel";
import LoginPanel from "./components/login";
import SignUpPanel from "./components/signUp";
import AboutPanel from "./components/AboutPanel";
import VoiceChatPanel from "./components/VoiceChatPanel";

export interface Persona {
  name: string;
  prompt: string;
}

function App() {
  const [currentPanel, setCurrentPanel] = useState<
    | "welcome"
    | "home"
    | "chat"
    | "explore"
    | "library"
    | "login"
    | "signup"
    | "profile"
    | "about"
    | "voicechat"
  >("welcome");

  const [selectedPersona, setSelectedPersona] = useState<Persona | undefined>(
    undefined
  );

  // Open chat panel, optionally with a persona
  const handleChatOpen = (persona?: Persona) => {
    setSelectedPersona(persona);
    setCurrentPanel("chat");
  };

  const handleProfileOpen = () => setCurrentPanel("profile");
  const handleExploreOpen = () => setCurrentPanel("explore");
  const handleLibraryOpen = () => setCurrentPanel("library");
  const handleBackClick = () => setCurrentPanel("home");
  const handleAboutClick = () => setCurrentPanel("about");

  const handleLogoutSuccess = () => setCurrentPanel("login");
  const handleLoginSuccess = () => setCurrentPanel("home");
  const handleSignUpSuccess = () => setCurrentPanel("home");
  const handleGetStarted = () => setCurrentPanel("home");

  const openVoiceChat = () => setCurrentPanel("voicechat");
  const closeVoiceChat = () => setCurrentPanel("home");

  // Toggle between login and signup
  const switchToSignUp = () => setCurrentPanel("signup");
  const switchToLogin = () => setCurrentPanel("login");

  return (
    <div className="h-screen bg-[#0c0920] relative text-white p-4">
      {currentPanel === "welcome" && (
        <WelcomePanel
          onGetStarted={handleGetStarted}
          onAboutClick={handleAboutClick}
        />
      )}

      {currentPanel === "home" && (
        <HomePanel
          onChatOpen={handleChatOpen}
          onProfileOpen={handleProfileOpen}
          onExploreOpen={handleExploreOpen}
          onLibraryOpen={handleLibraryOpen}
          onOpenVoiceChat={openVoiceChat} // Pass open voice chat function here
        />
      )}

      {currentPanel === "chat" &&
        (selectedPersona ? (
          <ChatPanelWithPersona
            persona={selectedPersona}
            onBackClick={handleBackClick}
          />
        ) : (
          <ChatPanel onBackClick={handleBackClick} />
        ))}

      {currentPanel === "voicechat" && (
        <VoiceChatPanel
          onBackClick={closeVoiceChat}
        />
      )}

      {currentPanel === "profile" && (
        <ProfilePanel
          onBackClick={handleBackClick}
          onLogoutSuccess={handleLogoutSuccess}
        />
      )}

      {currentPanel === "explore" && (
        <ExplorePanel onBackClick={handleBackClick} />
      )}

      {currentPanel === "library" && (
        <LibraryPanel onBackClick={handleBackClick} />
      )}

      {currentPanel === "login" && (
        <LoginPanel
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignUp={switchToSignUp}
        />
      )}

      {currentPanel === "signup" && (
        <SignUpPanel
          onSignUpSuccess={handleSignUpSuccess}
          onSwitchToLogin={switchToLogin}
        />
      )}

      {currentPanel === "about" && (
        <>
          <AboutPanel />
          <div className="absolute top-6 left-6">
            <button
              onClick={handleBackClick}
              className="text-white bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600 transition"
            >
              ← Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
