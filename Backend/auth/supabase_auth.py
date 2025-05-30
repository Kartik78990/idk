import os
import httpx
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_AUTH_URL = f"{SUPABASE_URL}/auth/v1"

headers = {
    "apikey": SUPABASE_ANON_KEY,
    "Content-Type": "application/json"
}

async def sign_up(email: str, password: str):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{SUPABASE_AUTH_URL}/signup",
            headers=headers,
            json={"email": email, "password": password}
        )
        return res.json()

async def sign_in(email: str, password: str):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{SUPABASE_AUTH_URL}/token?grant_type=password",
            headers=headers,
            json={"email": email, "password": password}
        )
        return res.json()
