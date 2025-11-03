import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_embedding(text: str):
    model = os.getenv("MODEL_EMBEDDING", "text-embedding-004")
    result = genai.embed_content(model=model, content=text)
    return result["embedding"]