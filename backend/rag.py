import os
from flask import jsonify
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.document_loaders import JSONLoader
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS

#load embeddings model
model = SentenceTransformerEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2', model_kwargs={"trust_remote_code":True})

# Define path to save FAISS index
VECTORSTORE_DIR = "backend/faiss_index"

# Initialize or load vector store
if os.path.exists(VECTORSTORE_DIR):
    vector_store = FAISS.load_local(VECTORSTORE_DIR, model, allow_dangerous_deserialization=True)
    print(f"Loaded FAISS index from '{VECTORSTORE_DIR}'")
else:
    vector_store = None
    print("No existing FAISS index found.")

#serialize fetched papers into vectorstore
def ingest(papers):
    global vector_store
    
    new_docs = []
    for paper in papers:
        new_doc = Document(
            page_content=f"Title: {paper['title']}\nAbstract: {paper['abstract']}",
            metadata={
                "title": paper["title"],
                "abstract": paper["abstract"],
                "authors": paper["authors"],
                "year": paper["year"],
                "url": paper["url"]
            }
        )
        #load new ingested document into list of docs and generate new embeddings
        new_docs.append(new_doc)
    
    #instantiate vector store
    if vector_store is None:
        vector_store = FAISS.from_documents(new_docs, model, normalize_L2=True)  # Initialize the vector store
    else: 
        vector_store.add_documents(new_docs)
    vector_store.save_local(VECTORSTORE_DIR)

    return {"success": f"{len(new_docs)} Research Papers successfully ingested"}, 200


def similarity_search(query, k=5):
    if vector_store is None:
        return jsonify({"error": "Vector store not initialized"}), 500

    results = vector_store.similarity_search_with_score(query, k=k)

    results_dict = {}
    for i, (res, score) in enumerate(results):
        results_dict[str(i)] = res.metadata
        results_dict[str(i)]["score"] = float(1 - score)

    return results_dict, 200

    