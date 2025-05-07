import os
from flask import json
import requests
import time
import pandas as pd
import constants

def fetch_semantic_scholar(query, total_results=1000, batch_size=100, output_path='papers.json'):
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
        headers = constants.keys_dict["x_api_key"]
        response = requests.get(base_url, params=params, headers={"x_api_key": headers})
        # response = requests.get(base_url, params=params)

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

        time.sleep(1)  #prevent rate limiting between batches

    df = pd.DataFrame(all_papers)
    df.to_json(orient='records', index=False, path_or_buf='papers.json')
    print(f"Fetched {len(all_papers)} papers.")
    return df.to_json(orient='records', index=False)
    # #load existing papers if file exists
    # if os.path.exists(output_path):
    #     with open(output_path, "r", encoding="utf-8") as f:
    #         existing_papers = json.load(f)
    # else:
    #     existing_papers = []

    # #combine and remove duplicates based on title
    # existing_titles = {p["title"] for p in existing_papers}
    # new_unique_papers = [p for p in all_papers if p["title"] not in existing_titles]
    # combined_papers = existing_papers + new_unique_papers

    # combined_df = pd.DataFrame(combined_papers)
    # combined_df.to_json(orient='records', index=False, path_or_buf='papers.json')

    # return combined_df.to_json(orient='records', index=False)