FROM node:8.7-stretch as build
LABEL maintainer="Tomasz Janas"

ARG FRONTEND_ADMIN_EMAIL
ENV FRONTEND_ADMIN_EMAIL="$FRONTEND_ADMIN_EMAIL"

ARG RECAPTCHA_SITE_KEY
ENV RECAPTCHA_SITE_KEY="$RECAPTCHA_SITE_KEY"

WORKDIR /usr/src/app
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn
COPY frontend .
RUN yarn prod

FROM nginx:1.13
LABEL maintainer="Tomasz Janas"

ARG FRONTEND_SSL_PORT
ENV FRONTEND_SSL_PORT="$FRONTEND_SSL_PORT"

COPY --from=build /usr/src/app/dist/prod /usr/src/app
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf.template
RUN envsubst '$FRONTEND_SSL_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
