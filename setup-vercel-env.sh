#!/bin/bash
# setup-vercel-env.sh - Run this once to set up all environment variables

echo "Setting up Vissar environment variables..."
echo ""
echo "You'll need:"
echo "1. Vercel CLI installed (npm i -g vercel)"
echo "2. To be logged into Vercel (vercel login)"
echo "3. Your Google Client Secret"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Link project if not already linked
if [ ! -d ".vercel" ]; then
    echo "Linking to Vercel project..."
    vercel link
fi

echo ""
echo "Setting environment variables..."

# Set environment variables
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET  
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

echo ""
echo "Deploying..."
vercel --prod

echo ""
echo "Done! Your site should be live shortly."
