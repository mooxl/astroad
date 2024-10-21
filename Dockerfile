FROM node:lts-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prune
WORKDIR /prune
RUN pnpm install -g turbo@2.0.14
COPY . .
RUN turbo prune @astroad/payload --docker --out-dir pruned-payload
RUN turbo prune @astroad/astro --docker --out-dir pruned-astro

FROM base as build-payload
WORKDIR /build
COPY package*.json ./
COPY . .
RUN yarn install
RUN yarn build

FROM base as runtime
ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js
WORKDIR /home/node/app
COPY package*.json  ./
COPY yarn.lock ./
RUN yarn install --production
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build
EXPOSE 3000
CMD ["node", "dist/server.js"]
