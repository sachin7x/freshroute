#!/bin/bash
# FreshRoute Deploy Script - Jaipur, Kishangarh, Bhilwara -> Full India
echo "FreshRoute Deploy - Production Ready"

# 1. Check env
if [ ! -f .env ]; then
  echo "Copy .env.example to .env and fill 5 keys: RAZORPAY, GOOGLE_MAPS, WHATSAPP, FCM, S3"
  cp .env.example .env
  exit 1
fi

# 2. Backend
echo "Starting backend..."
docker-compose -f infra/docker/docker-compose.yml up -d --build

# 3. Web builds
echo "Building web apps..."
cd apps/web-marketing && npm install && npm run build && cd ../..
cd apps/web-customer && npm install && npm run build && cd ../..
cd apps/web-admin && npm install && npm run build && cd ../..

# 4. Mobile APK
echo "Building APK..."
cd apps/mobile-customer && flutter build apk --release
echo "APK at build/app/outputs/flutter-apk/app-release.apk"
cd ../..

echo "Deploy Done - FreshRoute Ready for Jaipur!"
echo "Upload APK to Play Console, Web to Vercel, API to AWS ECS Mumbai ap-south-1"
