# FridgeChef website and API server.
#   docker build -t fridgechef .
#   docker run -p 3000:3000 fridgechef
# Optional: -e GEMINI_API_KEY=... for server-side AI. Without it, visitors can still add their
# own key in Settings, and the on-device recipe model always works.

FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx vite build && npm prune --omit=dev

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY package.json package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY server.ts ./
COPY server ./server
COPY src ./src
# Contact messages and analytics logs are written here
RUN mkdir -p /app/data && chown node:node /app/data
EXPOSE 3000
USER node
CMD ["npx", "tsx", "server.ts", "--prod"]
