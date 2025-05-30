import React, { useState, useEffect, useRef } from "react";

interface VoiceChatPanelProps {
  onBackClick: () => void;
  // Remove onSend since we'll stream live via WebSocket
}

const VoiceChatPanel: React.FC<VoiceChatPanelProps> = ({ onBackClick }) => {
  const [recording, setRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number>();
  const wsRef = useRef<WebSocket | null>(null);

  // Setup WebSocket connection on mount
  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8000/ws/voice-chat");

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    wsRef.current.onmessage = (event) => {
      console.log("Server says:", event.data);
      // Here you can parse and show partial transcripts or AI responses,
      // For example: setIsSpeaking(true/false) or update transcript state.
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    wsRef.current.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  // Mic volume visualization (same as before)
  useEffect(() => {
    if (!recording) {
      stopMicVisualization();
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      const analyze = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const avg = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
        setVolume(Math.min(avg / 100, 1));
        rafIdRef.current = requestAnimationFrame(analyze);
      };
      analyze();
    });

    return () => stopMicVisualization();
  }, [recording]);

  const stopMicVisualization = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (sourceRef.current) sourceRef.current.disconnect();
    if (analyserRef.current) analyserRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(e.data); // Send audio chunk immediately over WebSocket
      }
    };

    mediaRecorder.onstop = () => {
      // Optionally send a special message to indicate recording stopped
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ event: "stop" }));
      }
    };

    mediaRecorder.start(250); // collect 250ms chunks to stream live
    setRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const FilledWave = () => {
    const width = window.innerWidth;
    const height = 300;
    const points = 50;
    const baseHeight = 100;

    const amplitude = 40 + volume * 80;
    const frequency = 1.5;
    const now = performance.now() / 800;

    let path = `M 0 ${height} L 0 ${height - baseHeight} `;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const y =
        height -
        (baseHeight +
          amplitude * Math.sin(frequency * ((i / points) * 2 * Math.PI) + now));
      path += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    path += `L ${width} ${height} Z`;

    return (
      <svg
        width={width}
        height={height}
        className="fixed bottom-0 left-0 pointer-events-none select-none"
        style={{ zIndex: 10 }}
      >
        <defs>
          <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.3} />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="8"
              floodColor="#8b5cf6"
              floodOpacity="0.7"
            />
          </filter>
        </defs>

        <path d={path} fill="url(#waveGradient)" filter="url(#glow)" />
      </svg>
    );
  };

  return (
    <div className="p-6 bg-[#0c0920] text-white min-h-screen relative overflow-hidden">
      <button
        onClick={onBackClick}
        className="mb-4 bg-gray-700 px-4 py-2 rounded z-50 relative"
      >
        ← Back
      </button>

      <h2 className="text-xl mb-4 relative z-50">🎙️ Voice Chat with AI</h2>
      <FilledWave />

      <div className="fixed bottom-[120px] left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={recording ? handleStopRecording : handleStartRecording}
          disabled={isSpeaking}
          className="bg-pink-600 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-transform"
          title={recording ? "Stop Recording" : "Start Recording"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-10 h-10 ${recording ? "animate-pulse" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 1v11m0 0a3 3 0 006 0V4a3 3 0 00-6 0zM12 12v6m0 3a9 9 0 009-9H3a9 9 0 009 9z"
            />
          </svg>
        </button>
        <p className="mt-2 text-center text-gray-400">
          {recording ? "Recording..." : isSpeaking ? "Speaking..." : "Ready"}
        </p>
      </div>
    </div>
  );
};

export default VoiceChatPanel;
