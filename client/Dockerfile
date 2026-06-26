# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
# We need to supply the API URL during build if needed, though vite proxies by default in dev. 
# For prod we assume API is on the same domain or an injected env var.
RUN npm run build

# Serve stage
FROM nginx:alpine
# Copy custom nginx config if you have routing issues (SPA fallback)
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
