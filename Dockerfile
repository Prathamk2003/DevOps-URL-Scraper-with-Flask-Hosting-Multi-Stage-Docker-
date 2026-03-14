# ============================================================
# Stage 1: Node.js scraper (Puppeteer + Chromium)
# ============================================================
FROM node:18-slim AS scraper

# Install Chromium and runtime dependencies (skip Puppeteer's bundled download)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY scrape.js ./

# URL to scrape: pass at build time via --build-arg SCRAPE_URL=<url>
ARG SCRAPE_URL=https://rvu.edu.in/
ENV SCRAPE_URL=${SCRAPE_URL}

RUN node scrape.js

# ============================================================
# Stage 2: Python Flask server (final image)
# ============================================================
FROM python:3.10-slim AS final

WORKDIR /app

# Copy only the scraped output and server files (no Node/Chromium in final image)
COPY --from=scraper /app/scraped_data.json ./
COPY server.py ./
COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "server.py"]
