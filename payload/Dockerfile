FROM node:lts-alpine as base
WORKDIR /base
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3001
CMD ["yarn","dev"]


FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base .
RUN yarn build

FROM build as prod
ENV NODE_ENV=production
WORKDIR /prod
COPY package*.json  .
RUN yarn install --production

COPY --from=build /build/tsconfig.json ./tsconfig.json
COPY --from=build /build/dist ./dist
COPY --from=build /build/build ./build
EXPOSE 3000
CMD ["yarn", "serve"]