#!/bin/bash

echo "Pulling from repo..."

cd ../wdots-website
pm2 stop wdots-website
git pull
pm2 start index.js --name wdots-website
