FROM node:8.7-stretch
LABEL maintainer="Tomasz Janas"

WORKDIR /usr/src/app
RUN mkdir node_modules \
  && chown -R node:node .
COPY docker/node/run.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/run.sh

USER node
CMD ["run.sh"]
