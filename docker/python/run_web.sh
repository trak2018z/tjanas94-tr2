#!/bin/bash


# Wait for postgres
sleep 10

echo "Collect static files"
python manage.py collectstatic --noinput

echo "Apply database migrations"
python manage.py migrate

echo "Update permissions"
python manage.py update_permissions

if [ "$PROD" == "true" ]; then
  uwsgi --ini /etc/uwsgi.ini
else
  while true; do
    if [ "$ENABLE_PTVSD" == "true" ]; then
      echo "Starting server with remote debugger"
      python manage.py runserver_plus --noreload --nothreading
    else
      echo "Starting server with auto-reloading"
      python manage.py runserver_plus
    fi
    sleep 5
  done
fi
