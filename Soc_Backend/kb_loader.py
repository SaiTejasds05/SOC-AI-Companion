import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os

def load_knowledge_base():
    data_path = os.path.join("data", "production_soc_ai_l3_C_sample.csv")

    # Load CSV
    df = pd.read_csv(data_path)
    # Assuming there's a column called 'text' that has knowledge content
    if 'text' not in df.columns:
        df['text'] = df[df.columns[0]]  # use first column if 'text' doesn't exist

    texts = df['text'].dropna().tolist()

    # Load sentence transformer model
    model = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = model.encode(texts, convert_to_numpy=True)

    # Create FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    print(f"✅ Knowledge base loaded with {len(texts)} entries.")
    return index, texts, model