FROM python:3.6-stretch
LABEL maintainer="Tomasz Janas"

RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ stretch-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
  && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - 2>/dev/null \
  && apt-get update \
  && apt-get -y install libpq-dev \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY docker/python/run.sh /usr/local/bin/
CMD ["/bin/bash", "/usr/local/bin/run.sh"]
