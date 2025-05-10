import time
from flask import Flask, jsonify, request
from flask_cors import CORS
from scraper import fetch_semantic_scholar
from rag import ingest, similarity_search

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
    print(f"Fetched {len(papers_json)} papers.")
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
    

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)