FROM node:18-alpine AS base
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

FROM base AS builder
RUN apk update && apk add --no-cache git
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate
RUN yarn build

FROM base AS runner
WORKDIR /app
ENV OPENAI_API_KEY=""
ENV CODE=""
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server

EXPOSE 3000

CMD ["node", "server.js"]
