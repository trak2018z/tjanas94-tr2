#!/bin/bash


# Wait for rabbitmq
sleep 10

# Start worker
celery worker -A library.celery -l info
