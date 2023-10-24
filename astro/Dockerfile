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

FROM nginx:stable AS prod
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/dist /usr/share/nginx/html
EXPOSE 3000