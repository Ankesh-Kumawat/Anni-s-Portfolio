# 🚀 Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies (1 min)
```bash
npm install
```

### 2. Setup Cloudinary (2 min)
1. Go to https://cloudinary.com/users/register_free
2. Sign up (free tier)
3. Copy your **Cloud Name** from dashboard
4. Go to Settings → Upload → Add upload preset
5. Create **unsigned** preset
6. Copy preset name

Create `.env` file:
```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-preset-name
```

### 3. Setup Firebase (2 min)
1. Go to https://console.firebase.google.com/
2. Select project: **anni--portfolio**
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password**
5. Click **Add user**
6. Add your email and password (this is your admin login)

### 4. Setup Firestore
1. Go to **Firestore Database**
2. Click **Create Database**
3. Choose **Production mode**
4. Select region (closest to you)
5. Go to **Rules** tab
6. Paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

7. Click **Publish**

### 5. Run Development Server
```bash
npm run dev
```

### 6. Access Admin Panel
1. Open: http://localhost:5000/admin-login
2. Login with your Firebase email/password
3. You'll be redirected to `/editor`

## ✅ You're Done!

Now you can:
- ✅ Edit content in the editor
- ✅ Upload images (they go to Cloudinary)
- ✅ Save data (it goes to Firebase)
- ✅ View your portfolio at http://localhost:5000

## 🔄 Migrate Existing Data

If you have existing JSON data, run this in browser console after logging in:

```javascript
// Open /editor page
// Open browser console (F12)
// Paste this:

const migrateData = async () => {
  const response = await fetch('/data/about.json');
  const about = await response.json();
  
  const response2 = await fetch('/data/projects.json');
  const projects = await response2.json();
  
  const response3 = await fetch('/data/contact.json');
  const contact = await response3.json();
  
  // Import Firebase service
  const { saveAllData } = await import('./lib/firebase-service');
  
  await saveAllData({
    about,
    projects,
    contact,
    // Add other data...
  });
  
  console.log('✅ Data migrated to Firebase!');
};

migrateData();
```

## 🆘 Common Issues

### "Permission denied" in Firestore
- Make sure you're logged in
- Check Firestore rules are published
- Verify Authentication is enabled

### Images not uploading
- Check Cloudinary credentials in `.env`
- Make sure upload preset is **unsigned**
- Check browser console for errors

### Can't login
- Verify you created user in Firebase Authentication
- Check email/password are correct
- Clear browser cache and try again

## 📚 Next Steps

- Read [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed setup
- Read [README.md](./README.md) for full documentation
- Customize your portfolio content
- Deploy to Vercel

---

**Need help? Check the full documentation or open an issue!**
