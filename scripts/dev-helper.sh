#!/bin/bash

# Development helper script for NextJS React Three Fiber projects
# This script helps clear caches and restart the development server

echo "🧹 Clearing development caches..."

# Clear Next.js cache
rm -rf .next

# Clear node_modules cache (optional)
# rm -rf node_modules/.cache

# Clear browser cache files
find . -name "*.swp" -delete
find . -name "*.swo" -delete

# Clear any temporary files
rm -rf .turbo

echo "✅ Caches cleared!"

echo "🚀 Starting development server with clean cache..."
echo "Use: yarn dev:clean or npm run dev:clean"

# Start the development server
yarn dev:clean 