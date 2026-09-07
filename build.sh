#!/usr/bin/env bash
# Exit on error
set -o errexit

# Python dependencies install karein
pip install -r requirements.txt

# React ke client folder me jakar build banayein
cd client
npm install
npm run build
cd ..

# Django static files collect karein
python manage.py collectstatic --no-input

# Database migrations run karein
python manage.py migrate