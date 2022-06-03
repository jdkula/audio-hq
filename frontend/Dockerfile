# <-- Build setup -->
FROM --platform=$BUILDPLATFORM node:18-alpine AS deps-builder
WORKDIR /audio-hq
ENV YARN_CACHE_FOLDER=/yarn-cache
COPY package.json yarn.lock ./
RUN apk add --update --no-cache python3 libc6-compat && ln -sf python3 /usr/bin/python
RUN yarn install --frozen-lockfile --network-timeout 1000000

FROM --platform=$BUILDPLATFORM node:18-alpine AS builder
WORKDIR /audio-hq
COPY . ./
COPY --from=deps-builder /audio-hq/package.json ./package.json
COPY --from=deps-builder /audio-hq/node_modules ./node_modules
ARG HASURA_URL_HTTP=/v1/graphql
ARG HASURA_URL_WS=/v1/graphql
ENV NEXT_PUBLIC_HASURA_URL_HTTP=${HASURA_URL_HTTP}
ENV NEXT_PUBLIC_HASURA_URL_WS=${HASURA_URL_WS}
RUN yarn export

# <-- Runner setup -->
FROM caddy:2 AS runner
WORKDIR /usr/share/caddy
COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /audio-hq/out/ /usr/share/caddy/

ARG HASURA_URL_HTTP=/v1/graphql
ARG HASURA_URL_WS=/v1/graphql
ENV NEXT_PUBLIC_HASURA_URL_HTTP=${HASURA_URL_HTTP}
ENV NEXT_PUBLIC_HASURA_URL_WS=${HASURA_URL_WS}

EXPOSE 8080

WORKDIR /srv

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]