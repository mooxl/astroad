FROM node:lts-alpine as base
WORKDIR /base
COPY ./package.json ./package.json
RUN yarn install
COPY ./ ./

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["yarn","dev"]

FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
RUN yarn build

FROM nginx:stable AS prod
COPY --from=build /build/dist /usr/share/nginx/html
EXPOSE 3000