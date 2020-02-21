from flask import Flask, request
from flask_pymongo import PyMongo
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:28017/"
mongo = PyMongo(app)

search_route = "http://localhost:9200/drugs"

@app.route('/')
def home():
    return "Greetings"

@app.route('/data', methods=["POST", "GET"])
def data():
    data = {}
    return { "status": "OK", "data": data }, 200

@app.route('/search', methods=["POST", "GET"])
def search():
    print("GET /search")
    data = request.json
    results = []

    # Auto-complete query
    if data["suggest"]:
        query = {
            "suggest": {
                "records": {
                    "prefix": data["query"],
                    "completion": {
                        "field": "name"
                    }
                }
            }
        }

        resp = requests.post(url=(search_route + "/_search"), json=query)
        resp_json = resp.json()
        print(resp_json)
        for record in resp_json["suggest"]["records"]:
            for option in record["options"]:
                results.append({
                    "name": option["_source"]["name"],
                    "uuid": option["_source"]["uuid"],
                    "isDrug": option["_source"]["isDrug"]
                })
    # TODO: Regular search
    else:
        return { "status": "ERROR", "error": "Not supported" }, 405

    return { "status": "OK", "results": results }, 200

@app.route('/insert', methods=["POST"])
def insert():
    print("POST /insert")
    data = request.json

    # Check if drug is present
    query = {
        "query": {
            "term": { "uuid": data["uuid"] }
        }
    }
    resp = requests.get(url=(search_route + "/_search"), json=query)
    resp_json = resp.json()

    if resp_json["hits"]["total"]["value"] > 0:
        return { "status": "OK", "message": "Drug already added" }, 200

    # Continue adding drug
    es_data = {
        "uuid": data["uuid"],
        "name": data["name"],
        "isDrug": True,
    }
    resp = requests.post(url=(search_route + "/_doc"), json=es_data)
    print(resp.json())

    for mech in data["mechanisms"]:
        # Check if mechanism is present
        query = {
            "query": {
                "term": { "uuid": mech["uuid"] }
            }
        }
        resp = requests.get(url=(search_route + "/_search"), json=query)
        resp_json = resp.json()

        if resp_json["hits"]["total"]["value"] > 0:
            continue

        # Add missing mechanism
        es_data = {
            "uuid": mech["uuid"],
            "name": mech["name"],
            "isDrug": False,
        }
        resp = requests.post(url=(search_route + "/_doc"), json=es_data)
        print(resp.json())

    return { "status": "OK", "message": "Done" }, 200

