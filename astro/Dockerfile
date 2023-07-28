FROM node:lts-alpine as base
WORKDIR /base
COPY ./package.json ./package.json
RUN npm install
COPY ./ ./

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
ADD "https://random-uuid.deno.dev" skipcache
RUN npm run build

FROM nginx:stable AS prod
COPY --from=build /build/dist /usr/share/nginx/html
EXPOSE 3000