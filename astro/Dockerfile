FROM node:lts-alpine as base
WORKDIR /base
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["yarn","dev"]

FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base .
ADD "https://random-uuid.deno.dev" skipcache
RUN yarn build

FROM denoland/deno:1.36.1 AS prod
WORKDIR /site
RUN deno install --allow-net --allow-read https://deno.land/std@0.198.0/http/file_server.ts
COPY --from=build /build/dist .
CMD ["file_server", "--port", "3000", "--no-dir-listing"]
EXPOSE 3000