import requests
import time
import pandas as pd

def fetch_semantic_scholar(query, total_results=1000, batch_size=100):
    base_url = "https://api.semanticscholar.org/graph/v1/paper/search"
    fields = "title,abstract,authors,year,url"
    all_papers = []

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

    return pd.DataFrame(all_papers)

# Example usage
research_query = str(input("Enter your research query: "))
num_results_query = int(input("Enter the number of results you want (default is 1000): "))

df = fetch_semantic_scholar(research_query, total_results=num_results_query)
df.to_csv("research_papers.csv", index=False)
print(f"Saved {num_results_query} research papers to research_papers.csv")
