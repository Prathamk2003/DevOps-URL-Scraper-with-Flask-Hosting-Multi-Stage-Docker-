## DevOps-URL-Scraper-with-Flask-Hosting-Multi-Stage-Docker

# Prerequisites

- Docker installed on your system

# Building the Docker Image
```bash
docker build --build-arg SCRAPE_URL=https://www.java.com/en/ -t url-scraper-app .
```
# Running the Container

After building the image, run the container and expose port 5000:
```bash
docker run -p 5000:5000 url-scraper-app
```
This starts the Flask server inside the container.

# Run the locolhost on web browser
```bash
http://127.0.0.1:5000
```
# .dockerignore

Added to exclude unnecessary files and folders from the Docker build.

# Output
Here is an example of the output when scraping ```https://www.java.com/en/```:
<img width="1915" height="249" alt="Output" src="https://github.com/user-attachments/assets/620e286c-2a03-4352-a606-51f6b492d1da" />
