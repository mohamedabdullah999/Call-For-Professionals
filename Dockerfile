# syntax=docker/dockerfile:1
# Multi-stage build: install → build → small runtime image (~200 MB) with only what the server needs.

FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
# Cache the pnpm store between builds; fewer parallel downloads and more retries for slow networks
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm config set store-dir /pnpm-store && \
    pnpm install --frozen-lockfile --network-concurrency=4 --fetch-retries=5 --fetch-timeout=120000

FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Public URL (base path included) and base path are baked in at build time:
# canonical links, Open Graph, sitemap, and the /speakerreg prefix on every route and asset
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_BASE_PATH=/speakerreg
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:22-alpine AS run
WORKDIR /app
ARG NEXT_PUBLIC_BASE_PATH=/speakerreg
ENV BASE_PATH=$NEXT_PUBLIC_BASE_PATH
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/db ./db
COPY --from=build --chown=app:app /app/scripts/migrate.mjs ./scripts/migrate.mjs
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:3000${BASE_PATH}/api/health" >/dev/null || exit 1
# Apply pending migrations (retries until Postgres is ready), then start the server
CMD ["sh", "-c", "node scripts/migrate.mjs && node server.js"]
