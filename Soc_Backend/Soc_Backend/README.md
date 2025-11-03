# SOC Backend API

FastAPI-based backend for the SOC Copilot Sidebar Extension, powered by Google Gemini AI with RAG (Retrieval-Augmented Generation).

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in this directory:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey

### 3. Start Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at `http://localhost:8000`

## 📡 API Endpoints

### `GET /`

Health check endpoint.

**Response:**
```json
{
  "status": "Backend running",
  "message": "SOC AI Assistant Ready"
}
```

### `POST /ask`

Ask a question to the SOC AI Assistant.

**Request Body:**
```json
{
  "question": "What is a SOC?"
}
```

**Response:**
```json
{
  "question": "What is a SOC?",
  "context_used": [
    "A Security Operations Center (SOC) monitors and analyzes an organization's security posture.",
    "SIEM systems collect, analyze, and correlate security event data from various sources."
  ],
  "answer": "A Security Operations Center (SOC) is a centralized facility..."
}
```

## 🧠 How It Works

### RAG Pipeline

1. **Question Processing**: User question is encoded into embeddings
2. **Semantic Search**: FAISS searches the knowledge base for similar content
3. **Context Retrieval**: Top 3 most relevant documents are retrieved
4. **AI Generation**: Gemini LLM generates response using context
5. **Fallback**: If no relevant context found, uses general knowledge

### Knowledge Base

- Location: `data/soc_kb.txt`
- Format: One concept per line
- Updates: Simply edit the file and restart the server

## 🔧 Architecture

```
main.py               # FastAPI app, CORS, endpoints
llm_client.py         # Gemini API wrapper
embed_client.py       # Google embeddings
rag_pipeline.py       # RAG orchestration
kb_loader.py          # Knowledge base loading
data/soc_kb.txt       # Knowledge base content
```

## 🛠️ Development

### Adding More Knowledge

Edit `data/soc_kb.txt` and add one concept per line:

```
Your new SOC knowledge entry here
Another important concept
```

### Testing the API

```bash
# Test health endpoint
curl http://localhost:8000/

# Test question endpoint
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is SIEM?"}'
```

### Viewing API Docs

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📝 Dependencies

- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `google-generativeai`: Gemini AI
- `sentence-transformers`: Embeddings
- `faiss-cpu`: Vector search
- `numpy`: Numerical operations
- `python-dotenv`: Environment variables

## 🐛 Troubleshooting

### API Key Issues
- Ensure `.env` file exists with `GEMINI_API_KEY`
- No quotes around the key value
- Restart server after updating `.env`

### Import Errors
- Verify all dependencies installed: `pip install -r requirements.txt`
- Check Python version: `python --version` (should be 3.8+)

### Knowledge Base Not Loading
- Ensure `data/soc_kb.txt` exists
- Check file encoding is UTF-8
- Verify file has content

## 🔐 Security Notes

- ⚠️ CORS is currently set to `allow_origins=["*"]` for development
- In production, restrict to specific origins
- Never commit `.env` file with real API keys
- Consider adding authentication for production use

