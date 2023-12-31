FROM node:18-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./

RUN set -eux; \
    sed -i 's/npmmirror.com/npmjs.org/g' yarn.lock; \
    yarn install;

FROM base AS builder

RUN apk update && apk add --no-cache git

ENV OPENAI_API_KEY=""

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DATABASE_URL=""
RUN npx prisma generate; \
    yarn build;

FROM base AS runner
WORKDIR /app

ENV PROXY_URL=""
ENV OPENAI_API_KEY=""

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENTRYPOINT ["sh", "-c", "yarn run init-prod-db && node server.js"]
