FROM python:3.6-stretch
LABEL maintainer="Tomasz Janas"

WORKDIR /usr/src/app
RUN adduser --disabled-password --gecos '' app \
  && mkdir static \
  && chown -R app:app .\
  && echo "deb http://apt.postgresql.org/pub/repos/apt/ stretch-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
  && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - 2>/dev/null \
  && apt-get update \
  && apt-get -y install libpq-dev graphviz \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /etc
RUN pip install --no-cache-dir -r /etc/requirements.txt
COPY docker/python/run*.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/run*.sh

USER app
CMD ["run_web.sh"]
