FROM node:22-slim AS base
ARG PORT
ENV PORT=$PORT
ARG ORIGIN
ENV ORIGIN=$ORIGIN
ENV PUBLIC_ORIGIN=$ORIGIN
RUN apt-get update && apt-get install -y curl --no-install-recommends

FROM base AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM base
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/drizzle drizzle/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
ENV NODE_ENV=production
EXPOSE ${PORT}
CMD [ "node", "build/index.js" ]
