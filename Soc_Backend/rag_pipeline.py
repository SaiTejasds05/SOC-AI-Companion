from embed_client import get_embedding
from llm_client import generate_answer

def handle_query(user_query: str):
    # Step 1: Get embedding
    embedding = get_embedding(user_query)
    
    # Step 2: Mock context (later replaced with KB retrieval)
    context = "SOC knowledge base: Alerts enrichment, host data, IOC correlation."
    
    # Step 3: Create prompt
    prompt = f"""
    Context: {context}
    Analyst Query: {user_query}
    Provide a concise and actionable SOC investigation insight.
    """
    
    # Step 4: Generate AI answer
    answer = generate_answer(prompt)
    return answer