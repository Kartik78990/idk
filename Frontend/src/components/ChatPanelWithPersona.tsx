import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  ArrowLeft,
  Image,
  ThumbsUp,
  ThumbsDown,
  Settings,
  Mic,
  Loader2,
} from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import ChatMessage from "./ChatMessage";

interface Persona {
  name: string;
  prompt: string;
}

interface ChatPanelWithPersonaProps {
  persona: Persona;
  onBackClick: () => void;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const ChatPanelWithPersona: React.FC<ChatPanelWithPersonaProps> = ({
  persona,
  onBackClick,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi! I'm ${persona.name}. How can I assist you today?`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => console.log("✅ WebSocket connected");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const fullResponse = data.response || "No response received.";

      setIsGenerating(true);
      setTypingMessage("");

      let index = 0;
      const typingInterval = setInterval(() => {
        setTypingMessage((prev) => prev + fullResponse.charAt(index));
        index++;
        if (index >= fullResponse.length) {
          clearInterval(typingInterval);
          setIsGenerating(false);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              text: fullResponse,
              isUser: false,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          setTypingMessage("");
        }
      }, 30);
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket disconnected");

    setSocket(ws);
    return () => ws.close();
  }, []);

  useEffect(() => {
    // Auto-fill transcript when finished speaking
    if (!listening && transcript) {
      setNewMessage(transcript);
    }
  }, [transcript, listening]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    socket.send(
      JSON.stringify({ message: newMessage.trim(), personaPrompt: persona.prompt })
    );

    setNewMessage("");
    resetTranscript();
  };

  const handleVoiceInput = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file);
      // You can implement file upload handling here
    }
  };

  return (
    <div className="flex h-full bg-[#0c0920] text-white animate-fadeIn">
      <div className="flex-1 flex flex-col max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1d1d42]">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackClick}
              className="p-2 rounded-lg hover:bg-[#1d1d42] transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-xl font-semibold">{persona.name}</h2>
              <span className="text-gray-400 text-sm italic">{persona.prompt}</span>
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-[#1d1d42] transition-colors">
            <Settings size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                text={msg.text}
                isUser={msg.isUser}
                timestamp={msg.timestamp}
              />
            ))}
            {typingMessage && (
              <ChatMessage
                key="typing"
                text={typingMessage}
                isUser={false}
                timestamp={new Date().toLocaleTimeString()}
              />
            )}
            {isGenerating && (
              <div className="flex items-center gap-2 text-purple-400 mb-4">
                <Loader2 className="animate-spin" size={18} />
                <span>Generating response...</span>
              </div>
            )}
            {!messages[messages.length - 1]?.isUser && !typingMessage && (
              <div className="flex gap-2 mb-6">
                <button className="p-3 rounded-lg bg-[#2d2d50] hover:bg-[#393975]">
                  <ThumbsUp size={20} className="text-gray-400" />
                </button>
                <button className="p-3 rounded-lg bg-[#2d2d50] hover:bg-[#393975]">
                  <ThumbsDown size={20} className="text-gray-400" />
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-[#1d1d42]">
          <div className="max-w-3xl mx-auto flex items-center gap-3 p-2 bg-[#1a1a2e] rounded-lg">
            <button
              onClick={handleVoiceInput}
              className={`p-3 text-gray-400 transition-colors relative ${
                listening ? "text-red-500 animate-pulse" : "hover:text-gray-300"
              }`}
              aria-label="Voice input"
            >
              <Mic size={20} />
              {listening && (
                <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              )}
            </button>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Send a message"
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg"
              aria-label="Message input"
            />

            <span className="relative">
              <input
                type="file"
                id="file-upload"
                style={{ display: "none" }}
                onChange={handleFileUpload}
                accept="image/*, .pdf, .zip"
              />
              <label
                htmlFor="file-upload"
                className="p-1 rounded-lg text-gray-400 hover:text-gray-300 cursor-pointer"
              >
                <Image size={20} />
              </label>
            </span>

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isGenerating}
              className={`p-3 rounded-lg ${
                newMessage.trim() && !isGenerating
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-[#2d2d50] text-gray-500"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanelWithPersona;
