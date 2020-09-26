FROM mhart/alpine-node:10 as builder

WORKDIR /app

COPY . /app

ARG NPM_USERNAME
ARG NPM_TOKEN

RUN echo "$NPM_USERNAME:$NPM_TOKEN" > /tmp/auth && \
    apk add --no-cache binutils=2.30-r2 && \
    npm config set update-notifier false && \
    npm config set "@ci-reuse:registry=https://fala.cl/npm/" && \
    npm config set "@catalyst:registry=https://fala.cl/npm/" && \
    npm config set "//fala.cl/npm/:_auth=$(base64 /tmp/auth)" && \
    npm ci --no-audit --production && \
    strip /usr/bin/node

FROM alpine:3.10

COPY --from=builder /usr/bin/node /usr/bin/
COPY --from=builder /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/
COPY --from=builder /app /app

WORKDIR /app

RUN apk add --no-cache tini=0.18.0-r0
RUN apk add --no-cache curl=7.66.0-r1

ENV PORT=4444 \
    NODE_ENV=production \
    MAX_EVENT_LOOP_DELAY=1000 \
    MAX_RSS_BYTES=0 \
    MAX_HEAP_USED_BYTES=0 \
    MAX_AGE=86400

EXPOSE $PORT

# an init entrypoint that simplifies signal handling
COPY entrypoint.sh /usr/bin/entrypoint
ENTRYPOINT ["tini", "--"]
CMD ["entrypoint"]
