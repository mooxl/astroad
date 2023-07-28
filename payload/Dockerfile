FROM node:lts-alpine as base
WORKDIR /base
COPY ./package.json .
RUN npm install
COPY . .

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3001
CMD ["npm","run", "dev"]


FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base .
RUN npm run build

FROM build as prod
ENV NODE_ENV=production
WORKDIR /prod
COPY package*.json  .
RUN npm install --production

COPY --from=build /build/tsconfig.json ./tsconfig.json
COPY --from=build /build/dist ./dist
COPY --from=build /build/build ./build
EXPOSE 3000
CMD ["npm", "run", "serve"]