from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.document_loaders import JSONLoader
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS

#load embeddings model
model = SentenceTransformerEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2', model_kwargs={"trust_remote_code":True})

#declare global vector store 
vector_store = None

#serialize fetched papers into vectorstore
def ingest(papers):
    global vector_store
    
    new_docs = []
    for paper in papers:
        new_doc = Document(
            page_content=f"Title: {paper['title']}\nAbstract: {paper['abstract']}",
            metadata={
                "title": paper["title"],
                "authors": paper["authors"],
                "year": paper["year"],
                "url": paper["url"]
            }
        )
        #load new ingested document into list of docs and generate new embeddings
        new_docs.append(new_doc)
    
    #instantiate vector store
    if vector_store is None:
        vector_store = FAISS.from_documents(new_docs, model)  # Initialize the vector store
    else: 
        vector_store.add_documents(new_docs)

    print(vector_store)
    return {"success": f"{len(new_docs)} Research Papers successfully ingested"}, 200

