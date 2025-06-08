# Deployment Guide

## Environment Variables Setup

### Frontend (.env.local)
Create a `.env.local` file in the root directory:

\`\`\`env
# Firebase Configuration (Optional - Demo mode works without these)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Socket.IO Configuration
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# For production, update to your deployed server URL:
# NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.railway.app
\`\`\`

### Backend (server/.env)
Create a `server/.env` file:

\`\`\`env
# Server Configuration
PORT=3001
CLIENT_URL=http://localhost:3000

# For production:
# CLIENT_URL=https://your-app-domain.vercel.app
# PORT=3001
\`\`\`

## Local Development

### 1. Install Dependencies
\`\`\`bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
\`\`\`

### 2. Start Development Servers

**Terminal 1 - Frontend:**
\`\`\`bash
npm run dev
\`\`\`

**Terminal 2 - Backend:**
\`\`\`bash
npm run server
\`\`\`

### 3. Access Application
- Frontend: http://localhost:3000
- Backend Health Check: http://localhost:3001/health

## Production Deployment

### Frontend Deployment (Vercel)

1. **Deploy to Vercel:**
\`\`\`bash
npm run build
vercel --prod
\`\`\`

2. **Set Environment Variables in Vercel:**
- Go to your Vercel project dashboard
- Navigate to Settings > Environment Variables
- Add all the `NEXT_PUBLIC_*` variables

### Backend Deployment (Railway/Heroku)

1. **Railway Deployment:**
\`\`\`bash
cd server
# Connect to Railway and deploy
railway login
railway init
railway up
\`\`\`

2. **Set Environment Variables:**
- In Railway dashboard, go to Variables
- Add `PORT` and `CLIENT_URL` variables
- Update `CLIENT_URL` to your Vercel domain

3. **Update Frontend Socket URL:**
- Update `NEXT_PUBLIC_SOCKET_URL` in Vercel to your Railway URL
- Redeploy frontend

### Alternative: Deploy Both on Same Platform

**Vercel (Full-stack):**
\`\`\`bash
# Add to package.json scripts:
"build": "next build && cd server && npm install"
"start": "cd server && npm start"
\`\`\`

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | No | Demo mode |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | No | Demo mode |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | No | Demo mode |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL | Yes | localhost:3001 |
| `PORT` | Server port | No | 3001 |
| `CLIENT_URL` | Frontend URL for CORS | No | localhost:3000 |

## Testing Deployment

1. **Health Check:**
   - Visit `{SOCKET_URL}/health` to verify server is running

2. **Real-time Features:**
   - Open app in multiple browsers
   - Test task creation/updates
   - Verify live synchronization

3. **Authentication:**
   - Test demo login
   - Test registration (if Firebase configured)

## Troubleshooting

### Common Issues:

1. **Socket Connection Failed:**
   - Check `NEXT_PUBLIC_SOCKET_URL` is correct
   - Verify server is running and accessible
   - Check CORS configuration

2. **Firebase Auth Not Working:**
   - Verify all Firebase environment variables
   - Check Firebase project configuration
   - Use demo mode for testing

3. **Real-time Updates Not Working:**
   - Check browser console for Socket.IO errors
   - Verify server logs for connection issues
   - Test with `/health` endpoint

### Production Checklist:

- [ ] All environment variables set correctly
- [ ] Firebase project configured (if using auth)
- [ ] Socket.IO server deployed and accessible
- [ ] CORS configured for production domains
- [ ] Health check endpoint responding
- [ ] Real-time features tested across multiple clients
\`\`\`

Perfect! I've set up comprehensive environment variable configuration and deployment instructions. Here's what I've added:

## 🔧 **Environment Configuration:**

### **Frontend (.env.local):**
- Firebase configuration (optional - demo mode works without it)
- Socket.IO server URL configuration
- Production-ready environment variable setup

### **Backend (server/.env):**
- PORT configuration (defaults to 3001)
- CLIENT_URL for CORS configuration
- Production deployment variables

## 🚀 **Key Improvements:**

1. **Flexible Configuration:**
   - Works with or without Firebase setup
   - Automatic fallbacks to demo mode
   - Environment-specific URLs

2. **Production Ready:**
   - CORS configuration for multiple domains
   - Health check endpoint at `/health`
   - Graceful shutdown handling

3. **Connection Monitoring:**
   - Real-time connection status indicator
   - User count display
   - Connection error handling

4. **Deployment Support:**
   - Complete deployment guide
   - Platform-specific instructions (Vercel, Railway, Heroku)
   - Troubleshooting section

## 📋 **Quick Setup:**

1. **Copy the environment files** and update with your values
2. **For demo mode:** Just run with default values
3. **For production:** Update URLs to your deployed domains

The app now handles all environment configuration automatically and provides clear feedback about connection status. You can deploy it anywhere without hardcoded URLs!
