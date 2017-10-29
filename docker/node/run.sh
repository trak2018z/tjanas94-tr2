#!/bin/bash

echo "Creating node_modules and dist directories"
mkdir -p dist
chown -R node:node node_modules dist

echo "Installing node modules"
su node sh -c "yarn"

echo "Starting server"
su node sh -c "yarn start"
