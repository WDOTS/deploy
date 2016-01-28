#!/bin/bash

echo "Pulling from repo..."

# Change directory to ../wdots-website
# (this dir change is only for the purpose of this script.. it is reverted when the script is over)
cd ../wdots-website

# Stop the wdots-website pm2 service
pm2 stop wdots-website

# Pull the changes from git
git pull

# Install npm dependencies
npm install

# Run "npm start --port 80" with pm2
pm2 start "/usr/local/bin/npm" --name wdots-website -- start --port 80
