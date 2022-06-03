# <-- Runner setup -->
FROM node:18-alpine
WORKDIR /audio-hq
RUN apk add --update --no-cache ffmpeg python3 py3-pip alpine-sdk build-base libc6-compat py3-pycryptodomex py3-websockets py3-mutagen py3-brotli && ln -sf python3 /usr/bin/python
RUN python3 -m pip install --upgrade yt-dlp

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 1000000

COPY . ./
RUN yarn tsc

CMD ["node", "dist/index.js"]