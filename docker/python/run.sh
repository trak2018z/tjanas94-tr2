#!/bin/bash

# Collect static files
echo "Collect static files"
python manage.py collectstatic --noinput

# Apply database migrations
echo "Apply database migrations"
python manage.py migrate

# Start server
if [ "$ENABLE_PTVSD" == "true" ]; then
  echo "Starting server with remote debugger"
  python manage.py runserver_plus --noreload --nothreading
else
  echo "Starting server with auto-reloading"
  python manage.py runserver_plus
fi
