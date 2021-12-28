FROM node:latest as node
ENV NODE_ENV=production

ARG RCON_WEB_ADMIN_VERSION=0.14.1

WORKDIR /opt/rcon-web-admin

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci && npm cache clean --force

COPY . .

RUN npm install --production && \
    node src/main.js install-core-widgets && \
    chmod 0755 -R startscripts *

EXPOSE 4326

VOLUME ["/opt/rcon-web-admin/db"]

ENV RWA_ENV=TRUE

ENTRYPOINT ["/usr/local/bin/node", "src/main.js", "start"]