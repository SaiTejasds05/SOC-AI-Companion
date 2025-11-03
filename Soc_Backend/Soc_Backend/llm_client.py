import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_answer(prompt: str):
   #model_name = os.getenv("MODEL_TEXT", "gemini-1.5-flash")
   model = genai.GenerativeModel('gemini-1.5-flash')
   response = model.generate_content(prompt)
   return response.text