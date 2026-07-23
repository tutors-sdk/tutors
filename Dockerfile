FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
COPY svelte.config.node.js svelte.config.js

ARG PUBLIC_ANON_MODE=TRUE
ARG PUBLIC_SUPABASE_URL=""
ARG PUBLIC_SUPABASE_ANON_KEY=""
ARG PUBLIC_party_kit_main_room=""
ARG PUBLIC_PDF_KEY=""
ARG PUBLIC_COURSE_BASE_DOMAIN=".netlify.app"

ENV PUBLIC_ANON_MODE=$PUBLIC_ANON_MODE
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
ENV PUBLIC_SUPABASE_ANON_KEY=$PUBLIC_SUPABASE_ANON_KEY
ENV PUBLIC_party_kit_main_room=$PUBLIC_party_kit_main_room
ENV PUBLIC_PDF_KEY=$PUBLIC_PDF_KEY
ENV PUBLIC_COURSE_BASE_DOMAIN=$PUBLIC_COURSE_BASE_DOMAIN

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "build/index.js"]
