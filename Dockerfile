FROM node:17 AS deps-setup

WORKDIR /audio-hq
COPY package.json yarn.lock ./

FROM deps-setup AS deps
WORKDIR /audio-hq
RUN apt-get update && apt-get install -y python3 python-is-python3
RUN yarn install --frozen-lockfile --network-timeout 1000000

FROM deps AS deps-prod
WORKDIR /audio-hq
RUN yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile --network-timeout 1000000

FROM node:17 AS builder
WORKDIR /audio-hq
COPY . ./
COPY --from=deps /audio-hq/package.json ./package.json
COPY --from=deps /audio-hq/node_modules ./node_modules
RUN yarn build

FROM node:17 AS runner
WORKDIR /audio-hq

ENV NODE_ENV production

RUN addgroup -gid 1001 --system nodejs
RUN adduser --system nextjs -u 1001

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