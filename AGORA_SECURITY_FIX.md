# Agora SDK Security Error Fix Guide

## Problem
You're encountering these Agora SDK errors:
- `AgoraRTCError NOT_SUPPORTED: enumerateDevices() not supported`
- `AgoraRTCError WEB_SECURITY_RESTRICT: Your context is limited by web security, please try using https protocol or localhost`

## Root Cause
Agora SDK requires a **secure context** to access media devices (camera/microphone). This means:
- HTTPS protocol, OR
- localhost domain, OR 
- Secure context support

## Solutions

### Option 1: Use HTTPS in Development (Recommended)
Run the development server with HTTPS enabled:

```bash
npm run dev:https
```

This will start Next.js with experimental HTTPS support on `https://localhost:3000`

### Option 2: Ensure Localhost Usage
Make sure you're accessing the app via:
- `http://localhost:3000` (✅ Secure context)
- `http://127.0.0.1:3000` (✅ Secure context)

**NOT via:**
- `http://192.168.x.x:3000` (❌ Not secure context)
- Network IP addresses (❌ Not secure context)

### Option 3: Use a Custom Domain with HTTPS
If you need to test on a custom domain:

1. Install mkcert for local SSL certificates:
```bash
# Install mkcert (Windows)
choco install mkcert
# or download from: https://github.com/FiloSottile/mkcert/releases

# Create local certificate
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

2. Configure Next.js with custom SSL (advanced)

## Browser Requirements
Ensure your browser supports:
- WebRTC
- Secure contexts
- Modern JavaScript features

**Supported browsers:**
- Chrome 58+
- Firefox 55+
- Safari 11+
- Edge 79+

## Verification Steps

1. **Check Environment Info:**
   Open browser console and look for environment information logs

2. **Test Security Context:**
   Run in browser console:
   ```javascript
   console.log('Secure context:', window.isSecureContext);
   console.log('Protocol:', window.location.protocol);
   console.log('Hostname:', window.location.hostname);
   ```

3. **Expected Output for Working Setup:**
   ```
   Secure context: true
   Protocol: https: (or http: with localhost)
   Hostname: localhost (or 127.0.0.1)
   ```

## Quick Fix Commands

### Start with HTTPS (Easiest)
```bash
npm run dev:https
```
Then access: `https://localhost:3000`

### Regular Development
```bash
npm run dev
```
Then access: `http://localhost:3000` (NOT network IP)

## Troubleshooting

### Still Getting Errors?

1. **Clear Browser Cache:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

2. **Check Browser Permissions:**
   - Go to site settings
   - Ensure camera/microphone permissions are allowed

3. **Try Different Browser:**
   - Test in Chrome/Firefox
   - Ensure browser is updated

4. **Check Network Configuration:**
   - Disable VPN if active
   - Check firewall settings

### Advanced Debugging

Add this to browser console for detailed info:
```javascript
// Check Agora system requirements
import('agora-rtc-sdk-ng').then(AgoraRTC => {
  console.log('System requirements:', AgoraRTC.default.checkSystemRequirements());
});
```

## Production Deployment

For production, ensure:
- Site is served over HTTPS
- SSL certificate is valid
- All resources are served securely

## Code Changes Made

The following improvements were made to handle security issues:

1. **Enhanced error handling** in `AgoraUIKitPlayer.tsx`
2. **Security environment checks** in `utils/securityCheck.ts`
3. **Next.js configuration** for better HTTPS support
4. **Development scripts** for HTTPS testing

These changes provide better error messages and environment detection to help identify and resolve security-related issues.
