FROM --platform=$BUILDPLATFORM node:17-alpine AS deps-builder
WORKDIR /audio-hq
ENV YARN_CACHE_FOLDER=/yarn-cache
COPY package.json yarn.lock ./
RUN apk add --update --no-cache python3 libc6-compat && ln -sf python3 /usr/bin/python
RUN yarn install --frozen-lockfile --network-timeout 1000000

FROM --platform=$BUILDPLATFORM node:17-alpine AS builder
WORKDIR /audio-hq
COPY . ./
COPY --from=deps-builder /audio-hq/package.json ./package.json
COPY --from=deps-builder /audio-hq/node_modules ./node_modules
RUN yarn build


FROM node:17-alpine AS deps
WORKDIR /audio-hq
ENV YARN_CACHE_FOLDER=/yarn-cache
COPY package.json yarn.lock ./
COPY --from=deps-builder /yarn-cache /yarn-cache
COPY --from=deps-builder /audio-hq/node_modules ./node_modules
RUN apk add --update --no-cache python3 libc6-compat && ln -sf python3 /usr/bin/python
RUN yarn install --frozen-lockfile --prefer-offline --network-timeout 1000000

FROM deps AS deps-prod
WORKDIR /audio-hq
RUN yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile --network-timeout 1000000

FROM node:17-alpine AS runner-base
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN apk add --update --no-cache ffmpeg python3 py3-pip alpine-sdk build-base libc6-compat py3-pycryptodomex py3-websockets py3-mutagen py3-brotli && ln -sf python3 /usr/bin/python
RUN python3 -m pip install --upgrade yt-dlp

FROM runner-base AS runner
WORKDIR /audio-hq

COPY --from=deps-prod /audio-hq/node_modules ./node_modules
COPY --from=builder /audio-hq ./
COPY --from=builder --chown=nextjs:nodejs /audio-hq/.next ./.next
COPY --from=builder /audio-hq/.env* ./
USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]
