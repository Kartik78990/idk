from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from services.ai_services import generate_response  # Your async AI handler
from services.voice_service import handle_voice_chat

app = FastAPI()

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === WebSocket for regular text chat ===
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            user_message = data.get("message", "")
            ai_response = await generate_response(user_message)
            await websocket.send_json({"response": ai_response})
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print("Unexpected server error:", e)
        await websocket.send_json({"response": f"Error: {str(e)}"})

# === Voice chat upload endpoint ===
@app.websocket("/ws/voice-chat")
async def websocket_voice_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_bytes()  # receive raw audio chunk (bytes)
            # Here, send data to your speech-to-text or AI service (mock response for now)
            print(f"Received {len(data)} bytes of audio data")

            # Example: send back a mock transcription message
            await websocket.send_text("Partial transcript of received audio...")

    except WebSocketDisconnect:
        print("Client disconnected")