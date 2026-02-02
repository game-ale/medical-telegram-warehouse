import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(path):
    print(f"Testing {path}...")
    try:
        response = requests.get(f"{BASE_URL}{path}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            try:
                print(json.dumps(response.json(), indent=2)[:500] + "...")
            except:
                print(response.text[:500])
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Failed: {e}")
    print("-" * 20)

if __name__ == "__main__":
    test_endpoint("/")
    test_endpoint("/api/channels/CheMed123/activity")
    test_endpoint("/api/search/messages?query=product&limit=2")
    test_endpoint("/api/reports/top-products")
    test_endpoint("/api/reports/visual-content")
