FROM node:lts-slim as base
WORKDIR /astroad

RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY astro/package.json astro/
COPY payload/package.json payload/

FROM base AS deps-prod
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build-payload
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
WORKDIR /astroad/payload
RUN pnpm build

FROM base AS build-astro
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
WORKDIR /astroad/astro
RUN pnpm build

FROM base AS payload
COPY --from=deps-prod /astroad/node_modules/ ./node_modules
WORKDIR /astroad/payload
COPY --from=build-payload /astroad/payload/tsconfig.json ./tsconfig.json
COPY --from=build-payload /astroad/payload/package.json ./package.json
COPY --from=build-payload /astroad/payload/dist ./dist
COPY --from=build-payload /astroad/payload/build ./build
COPY --from=deps-prod /astroad/payload/node_modules/ ./node_modules
EXPOSE 3000
CMD ["pnpm", "serve"]

FROM nginx:alpine AS astro
COPY --from=build-astro /astroad/astro/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-astro /astroad/astro/dist /usr/share/nginx/html

# _____________ PAYLOAD _____________
# FROM node:lts-alpine as base
# WORKDIR /base
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile
# COPY . .

# FROM base AS dev
# ENV NODE_ENV=development
# EXPOSE 3001
# CMD ["yarn","dev"]


# FROM base AS build
# ENV NODE_ENV=production
# WORKDIR /build
# COPY --from=base /base .
# RUN yarn build

# FROM build as prod
# ENV NODE_ENV=production
# WORKDIR /prod
# COPY package*.json  .
# RUN yarn install --production

# COPY --from=build /build/tsconfig.json ./tsconfig.json
# COPY --from=build /build/dist ./dist
# COPY --from=build /build/build ./build
# EXPOSE 3000
# CMD ["yarn", "serve"]

# _____________ ASTRO _____________
# FROM node:lts-alpine as base
# WORKDIR /base
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# COPY package.json pnpm-lock.yaml ./
# RUN yarn install --frozen-lockfile
# COPY . .

# FROM base AS dev
# ENV NODE_ENV=development
# EXPOSE 3000
# CMD ["yarn","dev"]

# FROM base AS build
# ENV NODE_ENV=production
# WORKDIR /build
# COPY --from=base /base .
# ADD "https://random-uuid.deno.dev" skipcache
# RUN yarn build

# FROM denoland/deno:1.36.1 AS prod
# WORKDIR /site
# RUN deno install --allow-net --allow-read https://deno.land/std@0.198.0/http/file_server.ts
# COPY --from=build /build/dist .
# CMD ["file_server", "--port", "3000", "--no-dir-listing"]
# EXPOSE 3000
