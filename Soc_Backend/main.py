from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
import datetime

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize FastAPI app
app = FastAPI()

# Embedding model
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# --- Load Knowledge Base ---
def load_kb():
    kb_path = "data/soc_kb.txt"
    if not os.path.exists(kb_path):
        return []
    with open(kb_path, "r", encoding="utf-8") as f:
        docs = f.readlines()
    return [d.strip() for d in docs if d.strip()]

documents = load_kb()
if len(documents) > 0:
    doc_embeddings = embedder.encode(documents)
    index = faiss.IndexFlatL2(doc_embeddings.shape[1])
    index.add(np.array(doc_embeddings))
else:
    index = None

# Request Model
class Query(BaseModel):
    question: str

@app.get("/")
def home():
    return {"status": "Backend running", "message": "SOC AI Assistant Ready"}

@app.post("/ask")
def ask_gemini(data: Query):
    try:
        question = data.question.strip()

        # If KB exists, retrieve context
        context = ""
        retrieved_docs = []

        if index is not None and len(documents) > 0:
            q_emb = embedder.encode([question])
            D, I = index.search(np.array(q_emb), 3)
            retrieved_docs = [documents[i] for i in I[0]]
            context = "\n".join(retrieved_docs)

        # --- Intelligent fallback logic ---
        model = genai.GenerativeModel("gemini-1.5-flash")

        # If KB has relevant context (high similarity)
        if len(context.strip()) > 30:
            prompt = f"""
You are a SOC AI Assistant. Use the below knowledge base to answer precisely.

Knowledge Base:
{context}

Question: {question}

If the context is unrelated, use your general knowledge to answer accurately.
"""
        else:
            # If no KB match → use pretrained knowledge
            prompt = f"""
You are a helpful AI assistant. Answer the question accurately and clearly.

Question: {question}

Current date & time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""

        # --- Generate the response ---
        response = model.generate_content(prompt)

        return {
            "question": question,
            "context_used": retrieved_docs if retrieved_docs else "No relevant KB context found.",
            "answer": response.text.strip()
        }

    except Exception as e:
        return {"error": str(e)}
