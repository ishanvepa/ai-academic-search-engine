import requests

# Define the server URL and endpoint
url = "http://localhost:5000/"

# Send the POST request
query = "clinical outcomes of robotic surgery"


get_fetch_response = requests.get(f"{url}fetch-semantic-scholar", params={"query": query, "total_results": 1000, "batch_size": 100})

if get_fetch_response.status_code != 200:
    print("Error fetching papers:", get_fetch_response.status_code)
    print("Number papers fetched:", len(get_fetch_response.json()))
else:
    post_ingest_response = requests.post(f"{url}ingest", json=get_fetch_response.json())
    get_similarity_response = requests.get(f"{url}similarity-search", params={"query": query})

    print("Get Fetch Response:", get_fetch_response.status_code)
    print("Response JSON:", get_fetch_response.json())
    print("\nNumber papers fetched:", len(get_fetch_response.json()))


    print("\n\n\nPost Ingest Response:", post_ingest_response.status_code)
    print("Response JSON:", post_ingest_response.json())

    print("Get Similarity Response:", get_similarity_response.status_code)
    print("Response JSON:", get_similarity_response.json())