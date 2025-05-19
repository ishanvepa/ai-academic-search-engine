import time
from flask import Flask, jsonify, request
from flask_cors import CORS
from scraper import fetch_semantic_scholar
from rag import ingest, similarity_search 
from pypdf import PdfReader

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route("/fetch-semantic-scholar", methods=["GET"])
def r_fetch_semantic_scholar(total_results=100, batch_size=20):
    query = request.args.get('query')
    total_results = int(request.args.get('total_results', total_results))
    batch_size = int(request.args.get('batch_size', batch_size))

    if not query:
        return jsonify({"error": "Missing 'query' parameter"}), 400
    print(query)
    time.sleep(1)  # Prevent rate limiting
    papers_json = fetch_semantic_scholar(query, total_results, batch_size)
    retry = 0
    while (not papers_json or len(papers_json) <= 2) and retry < 10:
        print("No papers found, retrying...")
        time.sleep(1)
        papers_json = fetch_semantic_scholar(query, total_results, batch_size)
        if papers_json and len(papers_json) > 2:
            break
        retry += 1

    if(retry == 4):
        return jsonify({"error": "No papers found after multiple attempts"}), 500
    return papers_json

@app.route("/ingest", methods=["POST"])
def r_ingest():
    if not request.is_json:
        return jsonify({"error": "Invalid content type; expected JSON"}), 400
    papers = request.get_json()
    if not isinstance(papers, list):
        return jsonify({"error": "Request JSON must be a list of papers"}), 400
    result = ingest(papers)
    return jsonify(result), 200

@app.route("/similarity-search", methods=["GET"])
def r_similarity_search():
    query = request.args.get("query")
    
    k = request.args.get("k", 5)
    result = similarity_search(query, k=k)

    return jsonify(result), 200

#post request for larger text payload
@app.route("/similarity-search-pdf", methods=["POST"])
def r_similarity_search_pdf():
    if not request.is_json:
        return jsonify({"error": "Invalid content type or no payload passed; expected JSON with pdf text."}), 400
    pdf_text_query = request.get_json()["full_text"]    
    
    print(f"pdf_text_summary:{pdf_text_query}")

    k = request.args.get("k", 5)

    result = similarity_search(pdf_text_query, k=k)

    return jsonify(result), 200

#unstable
@app.route("/upload-pdf", methods=["POST"])
def r_upload_pdf():
    if 'pdfFile' not in request.files:
            return jsonify({'message': 'No file uploaded'}), 400
    file = request.files['pdfFile']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file:
        text_dict = process_pdf(file)
        # result = similarity_search(query=None, k=5, pdf_file_query=file)
        #query 

    return jsonify(text_dict), 200

def process_pdf(pdf_file_query):
    if pdf_file_query is None:
        return {"error": "No PDF file provided"}
    try:
        pdf_reader = PdfReader(pdf_file_query)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    except Exception as e:
        return {"error": f"Failed to read PDF: {str(e)}"}

    text_summary = summarize_text(text)
    print(f"PDF text summary: {text_summary}")
    return {
            "summary":text_summary,
            "full_text": text
           }
    # return {"message": "PDF uploaded", "Header": f"{text_summary[:30]}..."}
    

def summarize_text(text):
    if text is None:
        return {"error": "No PDF text available"}
    
    # Here you would implement the summarization logic
    # For now, we'll just return the first 100 characters
    summary = text[:100]
    return summary


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)