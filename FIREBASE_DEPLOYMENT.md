# Firebase Deployment Guide

This guide explains how to deploy Firestore indexes and security rules to your Firebase project.

## Prerequisites

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

1. Login to Firebase:

```bash
firebase login
```

1. Initialize Firebase in your project (if not already done):

```bash
firebase init
```

## Files Created

- **`firestore.indexes.json`** - Composite and single-field indexes for all collections
- **`firestore.rules`** - Security rules for Firestore database
- **`storage.rules`** - Security rules for Firebase Storage

---

## Deploy Commands

### Deploy Everything

```bash
firebase deploy
```

### Deploy Only Firestore

```bash
firebase deploy --only firestore
```

### Deploy Only Indexes

```bash
firebase deploy --only firestore:indexes
```

### Deploy Only Security Rules

```bash
firebase deploy --only firestore:rules
```

### Deploy Only Storage Rules

```bash
firebase deploy --only storage
```

---

## What Gets Deployed

### Firestore Indexes

Indexes for efficient querying on:

- **Products**: by category, brand, published status, timestamp
- **Blogs**: by status, featured flag, publish date, categories
- **Orders**: by user ID, status, timestamp
- **Stock**: by availability, stock levels, timestamp
- **Stock History**: by date (descending)
- **Reviews**: by product ID, rating

### Security Rules

- **Admin-only write** for all core collections
- **Public read** for products, blogs, categories, brands
- **User-specific access** for orders, checkout sessions
- **Authenticated write** for reviews

---

## Verification

After deployment, verify in Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Indexes**
4. Verify all composite indexes are created
5. Navigate to **Rules** tab
6. Verify security rules are deployed

---

## Common Issues

### Index Creation Takes Time

- Composite indexes can take several minutes to build
- Check status in Firebase Console under Indexes tab

### Deployment Fails

```bash
# Check your Firebase project is set
firebase projects:list

# Switch project if needed
firebase use <project-id>
```

### Rules Syntax Errors

```bash
# Test rules locally before deploying
firebase emulators:start --only firestore
```

---

## Local Testing (Optional)

Test indexes and rules locally with Firebase Emulator:

```bash
# Install emulators
firebase init emulators

# Start Firestore emulator
firebase emulators:start --only firestore
```

Update your app to use emulator:

```javascript
// In lib/firebase.jsx
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

---

## Important Notes

⚠️ **Deploy indexes BEFORE running queries** - Queries will fail without proper indexes

✅ **Deploy rules for security** - Default rules allow all access in production

🔄 **Re-deploy after changes** - Any changes to `.rules` or `.indexes.json` files require redeployment

---

## Next Steps

1. Deploy indexes: `firebase deploy --only firestore:indexes`
2. Deploy rules: `firebase deploy --only firestore:rules`
3. Deploy storage rules: `firebase deploy --only storage`
4. Verify in Firebase Console
5. Test your app queries
