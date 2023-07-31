# <-- Build setup -->
FROM --platform=$BUILDPLATFORM node:18-alpine AS builder
WORKDIR /audio-hq
RUN apk add --update --no-cache ffmpeg python3 py3-pip alpine-sdk build-base libc6-compat py3-pycryptodomex py3-websockets py3-mutagen py3-brotli yt-dlp && ln -sf python3 /usr/bin/python

ENV YARN_CACHE_FOLDER=/yarn-cache
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 1000000

COPY . ./
RUN yarn tsc



# <-- Runner setup -->
FROM node:18-alpine AS runner
WORKDIR /audio-hq
RUN apk add --update --no-cache ffmpeg python3 py3-pip alpine-sdk build-base libc6-compat py3-pycryptodomex py3-websockets py3-mutagen py3-brotli yt-dlp && ln -sf python3 /usr/bin/python

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 1000000

COPY --from=builder /audio-hq/dist ./dist

CMD ["node", "dist/index.js"]