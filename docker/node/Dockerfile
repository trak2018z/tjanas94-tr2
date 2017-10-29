FROM node:8.7-stretch
LABEL maintainer="Tomasz Janas"

WORKDIR /usr/src/app
COPY docker/node/run.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/run.sh

CMD ["run.sh"]
