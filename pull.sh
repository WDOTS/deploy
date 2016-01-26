#!/bin/bash

echo "Pulling from repo..."

# Change directory to ../wdots-website
cd ../wdots-website

# Stop the wdots-website pm2 service
pm2 stop wdots-website

# Pull the changes from git
git pull

# Start index.js with the name wdots-website
pm2 start index.js --name wdots-website
