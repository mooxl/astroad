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