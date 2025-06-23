import os
from flask import json
import requests
import time
import pandas as pd
import constants
import feedparser

def fetch_semantic_scholar(query, total_results=1000, batch_size=100, output_path='backend/papers.json'):
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
    df.to_json(orient='records', index=False, path_or_buf=output_path)
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


def fetch_arxiv(query, total_results=1000, batch_size=100, output_path='backend/arxiv_papers.json'):

    base_url = "http://export.arxiv.org/api/query"
    all_papers = []

    for start in range(0, total_results, batch_size):
        print(f"Fetching arXiv papers {start} to {start + batch_size}...")
        params = {
            "search_query": query,
            "start": start,
            "max_results": batch_size,
            "sortBy": "submittedDate",
            "sortOrder": "descending"
        }
        # Construct the query string
        query_str = "&".join([f"{k}={v}" for k, v in params.items()])
        url = f"{base_url}?{query_str}"

        response = requests.get(url)
        if response.status_code != 200:
            print(f"Error at start {start}: {response.status_code}")
            break

        feed = feedparser.parse(response.text)
        if not feed.entries:
            break

        for entry in feed.entries:
            authors = ", ".join([author.name for author in entry.authors])
            all_papers.append({
                "title": entry.title,
                "abstract": entry.summary,
                "authors": authors,
                "year": entry.published[:4],
                "url": entry.link
            })

        time.sleep(1)  # prevent rate limiting

    df = pd.DataFrame(all_papers)
    df.to_json(orient='records', index=False, path_or_buf=output_path)
    print(f"Fetched {len(all_papers)} arXiv papers.")
    return json.loads(df.to_json(orient='records', index=False))