FROM node:14

VOLUME ["/app"]

WORKDIR /app

RUN yarn install
# RUN yarn build

EXPOSE 3000
