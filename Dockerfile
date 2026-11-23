# The image tag MUST match the Playwright version in package.json.
# This project uses Playwright 1.65.1. Check yours with:  npm ls @playwright/test
# If this tag is not found, look up the matching one at mcr.microsoft.com/en-us/product/playwright
FROM mcr.microsoft.com/playwright:v1.65.1-noble

WORKDIR /app
ENV CI=true

# Copy package files first so Docker can cache the npm install layer
COPY package*.json ./
RUN npm ci

# Now copy the rest of the project
COPY . .

# Run UI + API tests when the container starts
CMD ["npx", "playwright", "test"]
