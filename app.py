import time
from flask import Flask, jsonify, request
from scraper import fetch_semantic_scholar
from rag import ingest, vector_store, model

app = Flask(__name__)

@app.route("/fetch_semantic_scholar", methods=["GET"])
def r_fetch_semantic_scholar(total_results=100, batch_size=20):
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Missing 'query' parameter"}), 400
    print(query)
    time.sleep(1)  # Prevent rate limiting
    papers_json = fetch_semantic_scholar(query, total_results, batch_size)
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

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)