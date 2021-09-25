FROM node:16 as builder

ENV NODE_ENV build

WORKDIR /app

COPY . /app

RUN npm ci && npm run build && npm prune --production

# ---

FROM node:16

ENV NODE_ENV production

USER node
WORKDIR /app

COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/dist/ /app/dist/

CMD ["node", "dist/main.js"]
