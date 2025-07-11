# Troubleshooting Guide

## Common Issues and Solutions

### 1. AgoraRTCError NOT_SUPPORTED: enumerateDevices() not supported

**Cause**: This error occurs when the Agora SDK tries to enumerate devices in a server-side rendering (SSR) environment or unsupported browser.

**Solutions**:

- ✅ Use dynamic imports with `ssr: false`
- ✅ Check for `typeof window !== 'undefined'` before initializing Agora
- ✅ Use the `AgoraVideoPlayerWrapper` component which handles SSR properly

### 2. AgoraRTCError WEB_SECURITY_RESTRICT: Your context is limited by web security

**Cause**: WebRTC requires a secure context (HTTPS) or localhost to function properly.

**Solutions**:

- ✅ Use `https://` in production
- ✅ Use `localhost` or `127.0.0.1` for development
- ✅ The app automatically detects and shows appropriate error messages

### 3. Error: window is not defined

**Cause**: Server-side rendering trying to access browser-only APIs.

**Solutions**:

- ✅ Use `'use client'` directive for client components
- ✅ Use dynamic imports with `ssr: false`
- ✅ Check `typeof window !== 'undefined'` before accessing window

### 4. Error: broadcasters.map is not a function

**Cause**: API response structure doesn't match expected format or network error.

**Solutions**:

- ✅ Added robust API response handling for different structures
- ✅ Mock data fallback in development mode
- ✅ Array validation before using `.map()`
- ✅ Proper error handling and retry mechanisms

## Development Setup

1. **Environment Variables**:

   ```bash
   # Copy .env.local and update with your values
   NEXT_PUBLIC_AGORA_APP_ID=your-agora-app-id
   NEXT_PUBLIC_USE_MOCK_DATA=true
   ```

2. **HTTPS Development** (if needed):

   ```bash
   # Install mkcert for local HTTPS
   npm install -g mkcert
   mkcert -install
   mkcert localhost

   # Update package.json dev script
   "dev": "next dev --experimental-https --experimental-https-key ./localhost-key.pem --experimental-https-cert ./localhost.pem"
   ```

3. **Testing with Mock Data**:
   - Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in `.env.local`
   - Mock data will be used when API calls fail
   - Perfect for development and testing

## Architecture Overview

```
src/
├── components/
│   ├── AgoraVideoPlayer.tsx          # Core Agora integration
│   ├── AgoraVideoPlayerWrapper.tsx   # SSR-safe wrapper
│   ├── BroadcasterCard.tsx          # Broadcaster display
│   ├── StreamViewer.tsx             # Main viewer component
│   ├── EmbeddablePlayer.tsx         # Embeddable component
│   └── ErrorBoundary.tsx            # Error handling
├── hooks/
│   └── useStreaming.ts              # Streaming state management
├── services/
│   └── streamingService.ts          # API calls with fallbacks
└── types/
    └── streaming.ts                 # TypeScript interfaces
```

## Embedding in External Websites

Use this iframe code:

```html
<iframe
  src="https://your-domain.com/embed?streamId=STREAM_ID&width=800px&height=450px"
  width="800"
  height="450"
  frameborder="0"
  allowfullscreen
>
</iframe>
```

## API Integration

The app expects these API endpoints:

1. **GET /api/streaming** - List broadcasters
2. **GET /api/streaming/{stream_id}** - Get stream details

Expected response formats are handled flexibly with fallbacks.
