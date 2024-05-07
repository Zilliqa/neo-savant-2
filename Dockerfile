# build stage
FROM node:18.20 as build-stage

WORKDIR /savant-ide
COPY ./package.json ./yarn.lock ./
RUN yarn install -E
COPY . /savant-ide
RUN yarn build

# production stage
FROM nginx:latest
COPY --from=build-stage /savant-ide/dist/spa /usr/share/nginx/html
EXPOSE 80
