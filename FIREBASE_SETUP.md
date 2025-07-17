# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database

## 2. Get Configuration

1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click "Web" icon to add web app
4. Copy the config object

## 3. Environment Variables

Create `.env.local` file with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 4. Firestore Rules

Set up basic security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{streamId}/messages/{messageId} {
      allow read, write: if true; // For demo - use proper auth in production
    }
  }
}
```

## 5. Test the Chat

1. Start the development server: `npm run dev`
2. Join a live stream
3. Enter a username to join chat
4. Send messages and see real-time updates
