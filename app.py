import time
from flask import Flask, jsonify, request
from scraper import fetch_semantic_scholar


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

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)