FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# Ensure uploads and logs directories exist with correct permissions
RUN mkdir -p uploads logs && chown -R node:node uploads logs

EXPOSE 5000

USER node

CMD ["node", "server.js"]
