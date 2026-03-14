## DevOps-URL-Scraper-with-Flask-Hosting-Multi-Stage-Docker

This project demonstrates a multi-stage Docker workflow where a webpage is scraped using Node.js and Puppeteer, and the extracted data is later served through a Python Flask API.

During the build process, the scraper collects data from a specified URL and stores it as JSON. The final Docker image only includes the lightweight Python environment and the scraped data, making it efficient and minimal.

# Project Overview

The Docker build is divided into two stages:

Stage 1 – Web Scraping

- Uses a Node.js (node:18-slim) environment.

- Installs Chromium and Puppeteer to access and render webpages.

- Executes the scrape.js script to scrape:

  - The webpage title
  
  - The first h1 heading

- Saves the extracted information into a file called scraped_data.json.

Stage 2 – Data Hosting

- Uses a Python (python:3.10-slim) environment.

- Installs Flask.

- Copies the generated scraped_data.json and the Flask server file.

- Hosts the scraped data through a simple HTTP API.

The final container contains only the Python runtime and the JSON data, keeping the image small and optimized.

# Prerequisites

Before running this project, ensure you have:

- Docker installed on your system

# Building the Docker Image

When building the Docker image, you can specify the URL that should be scraped using a build argument.

Example:
```bash
docker build --build-arg SCRAPE_URL=https://example.com -t url-scraper-app .
```
If you want to scrape another website, simply replace the URL:
```bash
docker build --build-arg SCRAPE_URL=https://www.github.com -t url-scraper-app .
```
If no URL is provided, the build process automatically defaults to https://example.com

# Running the Container

After building the image, run the container and expose port 5000:
```bash
docker run -p 5000:5000 url-scraper-app
```
This starts the Flask server inside the container.

# Accessing the Scraped Data

Once the container is running, the scraped data can be accessed through:

Browser
```bash
http://localhost:5000/
```
Using curl
```bash
curl http://localhost:5000/
```
The API returns a JSON response similar to:
```bash
{
  "url": "https://example.com/",
  "title": "Example Domain",
  "firstHeading": "Example Domain",
  "scrapedAt": "2025-03-14T12:00:00.000Z"
}
```
# Health Check Endpoint

The application also provides a simple health check endpoint:
```bash
http://localhost:5000/health
```
Response:
```bash 
{"status": "ok"}
```
This confirms that the server is running correctly.

# Providing the URL to Scrape

In this setup, the URL is typically passed during the Docker build stage.

Example:
```bash
docker build --build-arg SCRAPE_URL=https://example.com -t url-scraper-app .
```
# .dockerignore

Added the following to exclude unnecessary files and folders from the Docker build.

- node_modules
- .git
- .gitignore
- *.md
- !README.md
- __pycache__
- *.pyc
- .venv
- venv
- .env*

# Project Structure
```bash
.
├── Dockerfile
├── scrape.js
├── server.py
├── package.json
├── requirements.txt
└── README.md
```
