import os
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from groq import Groq
import gradio
# Initialize the Pinecone instance (using your API key)
# Initialize the Pinecone instance (using your API key)
class PineconeClient:
    def __init__(self, api_key, environment):
        self.pinecone = Pinecone(api_key=api_key, environment=environment)

    def connect_to_index(self, index_name):
        if index_name not in self.pinecone.list_indexes().names():
            raise ValueError(f"Index {index_name} does not exist.")
        return self.pinecone.Index(index_name)

def get_query_embedding(query):
    """
    Generate embedding for a given query using a real embedding model.

    Args:
        query (str): User query to be embedded.

    Returns:
        query_embedding (list): A list representing the query's embedding vector.
    """
    model = SentenceTransformer('all-MiniLM-L6-v2')  # Replace with the model of your choice
    query_embedding = model.encode(query).tolist()  # Generate embeddings and convert to list
    return query_embedding

# Function to retrieve context from Pinecone based on user query
def retrieve_context_from_pinecone(query, pinecone_client, index_name, top_k=5):
    """
    Retrieve relevant context from Pinecone based on the user query.

    Args:
        query (str): User's input query.
        pinecone_client (PineconeClient): Initialized Pinecone client.
        index_name (str): The name of the Pinecone index.
        top_k (int): The number of top results to retrieve from Pinecone.

    Returns:
        context (str): Retrieved context to be used in the chatbot response.
    """
    # Connect to the Pinecone index
    index = pinecone_client.connect_to_index(index_name)

    # Embed the query using the embedding model
    query_embedding = get_query_embedding(query)

    # Perform a similarity search in Pinecone to get the top_k matches
    query_response = index.query(vector=query_embedding, top_k=top_k, include_metadata=True)

    # Collect the results from Pinecone (assumes metadata includes a 'text' field)
    retrieved_contexts = []
    for match in query_response['matches']:
        context_text = match['metadata'].get('text', '')  # Extract the context from metadata
        retrieved_contexts.append(context_text)

    # Combine the retrieved contexts into one
    combined_context = " ".join(retrieved_contexts)

    return combined_context

# Function to summarize context to fit within token limits
def summarize_context(context, max_length=999):
    """Summarize or truncate context to fit within token limits."""
    words = context.split()
    if len(words) > max_length:
        return ' '.join(words[:max_length]) + '...'  # Simple truncation
    return context

# Function to generate text with the LLM (LLaMA model via Groq API)
def generate_text_with_llama(prompt):
    """Generate a response using the Llama model on Groq."""
    try:
        # Initialize the Groq client
        client = Groq(
            api_key=os.getenv("GROQ_API_KEY")  # Ensure your API key is set in environment variables
        )

        # Make the API call for chat completion
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192"  # Make sure this matches your available model
        )

        # Extract the response content
        return chat_completion.choices[0].message.content

    except Exception as e:
        print(f"Error: {e}")
        return "Error: Failed to get a valid response from the model."

# Main function to handle chatbot queries
def chatbot_query(query, pinecone_client, index_name):
    """Main function to handle chatbot queries."""
    # Retrieve context from Pinecone based on user query
    context = retrieve_context_from_pinecone(query, pinecone_client, index_name)

    # Summarize the context to fit within token limits
    summarized_context = summarize_context(context)

    # Create a prompt combining the summarized context and the user query
    prompt = f"Context: {summarized_context}\n\nUser Query: {query}\n\nResponse:"

    # Generate a response using the LLM
    response = generate_text_with_llama(prompt)

    return response
def chatbot_interface(query):
    try:
        response = chatbot_query(query, pinecone_client, index_name)
        return response
    except ValueError as e:
        return str(e)
# Example usage
if __name__ == "__main__":
    # Ensure you export the API key
    os.environ['GROQ_API_KEY'] = "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"

    # Initialize Pinecone client
    pinecone_api_key = "9bd99bfc-c2a8-4e7d-8a11-ec14b148e0fe"
    pinecone_env = "us-east-1"
    index_name = "sensara-tech"

    pinecone_client = PineconeClient(api_key=pinecone_api_key, environment=pinecone_env)
    css = """
/* Set the background color to white */
body {
    background-color: #ffffff;
    color: #000000;
    font-family: 'Arial', sans-serif;
}

/* Title styling */
h1 {
    color: #333333;
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 20px;
}

/* Textbox input styling */
textarea {
    background-color: #f8f9fa;
    border: 1px solid #cccccc;
    color: #000000;
    padding: 10px;
    font-size: 16px;
    border-radius: 8px;
}

/* Button styling */
button {
    background-color: #FFB6B9;
    color: #ffffff;
    font-weight: bold;
    border: none;
    padding: 12px 20px;
    border-radius: 10px;
    transition: 0.3s ease;
}

button:hover {
    background-color: #f78fa7;
    cursor: pointer;
}

/* Chat output text box styling */
.output_text {
    background-color: #f8f9fa;
    border: 1px solid #dddddd;
    border-radius: 10px;
    padding: 20px;
    margin-top: 10px;
    font-size: 1.2em;
    color: #000000;
}

/* Sidebar Navigation */
.sidebar {
    background-color: #FFEEEA;
    padding: 15px;
    border-radius: 15px;
}

/* Card box shadow and styling */
.card {
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #e0e0e0;
}

.card h2 {
    color: #FD7277;
}
"""

    iface = gradio.Interface(
    fn=chatbot_interface,
    inputs=gradio.Textbox(lines=2, placeholder="Enter your query here..."),
    outputs="text",
    title="Sansera Tech Chatbot",
    description="Ask me anything about the raw material phase of estimation", theme='earneleh/paris'
)

# Launch the interface
    iface.launch()
