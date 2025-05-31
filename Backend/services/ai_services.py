# services/ai_service.py

import httpx
import os
from dotenv import load_dotenv

# Load secrets from .env
load_dotenv()

HUGGINGFACE_TOKEN = os.getenv("HF_TOKEN")
print("Token:", HUGGINGFACE_TOKEN)  # Only for debugging; remove later

MODEL = "deepseek-ai/DeepSeek-R1-0528" 

async def generate_response(message: str) -> str:
    headers = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}"}
    payload = {"inputs": message}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api-inference.huggingface.co/models/{MODEL}",
                headers=headers,
                json=payload,
                timeout=60.0
            )
            result = response.json()
            # Handle typical response format
            if isinstance(result, list) and "generated_text" in result[0]:
                return result[0]["generated_text"]
            return str(result)
    except Exception as e:
        return f"Error contacting Hugging Face: {str(e)}"
