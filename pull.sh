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

# Start index.js with the name wdots-website
pm2 start index.js --name wdots-website
