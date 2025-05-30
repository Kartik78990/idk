# service/voice_service.py
import os
import tempfile
import requests
from dotenv import load_dotenv

# Load secrets from .env
load_dotenv()
from pathlib import Path

from .ai_services import generate_response   # ← your existing text-chat fn

HF_API_KEY = os.getenv("HF_TOKEN")  # export HF_API_KEY=xxxxxxxx
STT_MODEL  = "openai/whisper-large-v3"
TTS_MODEL  = "facebook/fastspeech2-en-ljspeech"

HEADERS_STT = {
    "Authorization": f"Bearer {HF_API_KEY}",
    "Content-Type": "audio/webm",
}

HEADERS_TTS = {
    "Authorization": f"Bearer {HF_API_KEY}",
    "Accept": "audio/flac",
    "Content-Type": "application/json",
}

# ---------- Hugging Face calls ----------
def hf_stt(audio_path: Path) -> str:
    url = f"https://api-inference.huggingface.co/models/{STT_MODEL}"
    with audio_path.open("rb") as f:
        out = requests.post(url, headers=HEADERS_STT, data=f, timeout=90)
    out.raise_for_status()
    return out.json().get("text", "").strip()

def hf_tts(text: str, out_path: Path) -> Path:
    url = f"https://api-inference.huggingface.co/models/{TTS_MODEL}"
    r = requests.post(url, headers=HEADERS_TTS, json={"inputs": text}, timeout=90)
    r.raise_for_status()
    out_path.write_bytes(r.content)
    return out_path

# ---------- Public API ----------
async def handle_voice_chat(audio_bytes: bytes) -> dict:
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = Path(tmp.name)

    transcript = hf_stt(tmp_path)  # Assuming this is sync, no change here
    response_text = await generate_response(transcript)  # Await the async function

    # Continue as usual
    tts_path = tmp_path.with_suffix(".flac")
    hf_tts(response_text, tts_path)

    return {
        "transcript": transcript,
        "response": response_text,
        "audio_path": str(tts_path),
    }

