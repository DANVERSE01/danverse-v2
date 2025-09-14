#!/bin/bash

# DANVERSE v2 Deployment Script
# This script deploys the project to Vercel using the CLI

set -e

echo "🚀 DANVERSE v2 Deployment Script"
echo "================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please run:"
    echo "   vercel login"
    echo "   or set VERCEL_TOKEN environment variable"
    exit 1
fi

echo "✅ Vercel CLI ready"

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Vercel Dashboard"
echo "2. Copy values from env/.env.production.example"
echo "3. Redeploy to activate production mode"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"

