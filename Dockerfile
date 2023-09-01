FROM node:lts-alpine as base
WORKDIR /astroad

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY astro/package.json astro/
COPY payload/package.json payload/

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run -r build

FROM nginx:alpine AS astro
COPY --from=build /astroad/astro/dist /usr/share/nginx/html
EXPOSE 3000

FROM node:lts-alpine AS payload
WORKDIR /payload
COPY --from=build astroad/payload/build/tsconfig.json ./tsconfig.json
COPY --from=build astroad/payload/build/dist ./dist
COPY --from=build astroad/payload/build/build ./build
COPY --from=prod-deps /astroad/payload/node_modules/ /astroad/payload/node_modules
EXPOSE 3000
CMD ["pnpm", "serve"]

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
