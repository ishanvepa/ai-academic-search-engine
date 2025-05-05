import requests
import time
import pandas as pd
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/fetch_semantic_scholar", methods=["GET"])
def fetch_semantic_scholar(total_results=1000, batch_size=100):
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Missing 'query' parameter"}), 400
    print(query)
    base_url = "https://api.semanticscholar.org/graph/v1/paper/search"
    fields = "title,abstract,authors,year,url"
    all_papers = []

    time.sleep(1)  #prevent rate limiting
    for offset in range(0, total_results, batch_size):
        print(f"Fetching papers {offset} to {offset + batch_size}...")
        params = {
            "query": query,
            "offset": offset,
            "limit": batch_size,
            "fields": fields
        }
        response = requests.get(base_url, params=params)
        if response.status_code != 200:
            print(f"Error at offset {offset}: {response.status_code}")
            break

        data = response.json().get('data', [])
        for paper in data:
            all_papers.append({
                "title": paper.get("title"),
                "abstract": paper.get("abstract"),
                "authors": ", ".join([a["name"] for a in paper.get("authors", [])]),
                "year": paper.get("year"),
                "url": paper.get("url")  
            })

        time.sleep(1)  #prevent rate limiting

    df = pd.DataFrame(all_papers)
    print(f"Fetched {len(all_papers)} papers.")
    return df.to_json(orient='records', index=False)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)