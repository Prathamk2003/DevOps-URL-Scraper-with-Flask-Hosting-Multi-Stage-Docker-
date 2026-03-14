"""
Flask server that reads scraped_data.json and serves it as JSON at /.
"""
import json
import os
from flask import Flask, jsonify

app = Flask(__name__)
DATA = os.environ.get("SCRAPED_DATA_FILE", "scraped_data.json")


def load():
    path = os.path.join(os.path.dirname(__file__), DATA)
    if not os.path.isfile(path):
        return {"error": "Scraped data file not found", "path": path}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


@app.route("/")
def index():
    return jsonify(load())


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
