// src/utils/socket.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase'; // Optional: your generated Supabase types

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

let socket: WebSocket | null = null;

export const initSocket = async (
  onMessage: (msg: string) => void,
  onOpen?: () => void,
  onClose?: () => void,
  onError?: (error: Event) => void
) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    console.error("🚫 No token found. User not logged in?", error);
    return;
  }

  socket = new WebSocket(import.meta.env.VITE_WS_URL/ws);

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
    onOpen?.();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("🤖 AI says:", data.response);
      onMessage(data.response);
    } catch (err) {
      console.error("❌ Failed to parse WebSocket message:", err);
    }
  };

  socket.onclose = () => {
    console.warn("❌ WebSocket closed");
    onClose?.();
  };

  socket.onerror = (event) => {
    console.error("⚠️ WebSocket error:", event);
    onError?.(event);
  };
};

export const sendMessage = (message: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ message }));
  } else {
    console.warn("⚠️ WebSocket is not open. Message not sent.");
  }
};

export const closeSocket = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    console.log("🔌 WebSocket manually closed.");
  }
};
