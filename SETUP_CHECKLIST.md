# ✅ Setup Checklist

Use this checklist to ensure everything is configured correctly.

## 📋 Pre-Setup

- [ ] Node.js installed (v18 or higher)
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## 🔧 Installation

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Verify no errors in installation

## ☁️ Cloudinary Setup

- [ ] Create Cloudinary account at https://cloudinary.com
- [ ] Copy Cloud Name from dashboard
- [ ] Create upload preset (Settings → Upload)
- [ ] Make preset **unsigned**
- [ ] Copy preset name
- [ ] Add to `.env`:
  ```env
  VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
  VITE_CLOUDINARY_UPLOAD_PRESET=your-preset-name
  ```

## 🔥 Firebase Setup

### Authentication
- [ ] Go to Firebase Console
- [ ] Select project: `anni--portfolio`
- [ ] Go to Authentication → Sign-in method
- [ ] Enable Email/Password
- [ ] Click "Add user"
- [ ] Create admin account (save credentials!)

### Firestore Database
- [ ] Go to Firestore Database
- [ ] Click "Create Database"
- [ ] Choose "Production mode"
- [ ] Select region (closest to you)
- [ ] Wait for database creation

### Firestore Rules
- [ ] Go to Firestore → Rules tab
- [ ] Paste security rules:
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
- [ ] Click "Publish"
- [ ] Verify rules are active

### Firebase Storage (Optional)
- [ ] Go to Storage
- [ ] Click "Get Started"
- [ ] Choose production mode
- [ ] Set rules:
  ```javascript
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      match /{allPaths=**} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
  ```

## 🧪 Testing

### Local Development
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5000
- [ ] Verify portfolio loads
- [ ] Check all apps work

### Admin Login
- [ ] Navigate to http://localhost:5000/admin-login
- [ ] Login with Firebase credentials
- [ ] Verify redirect to `/editor`
- [ ] Check no console errors

### Editor Testing
- [ ] Open `/editor`
- [ ] Try editing some content
- [ ] Click "Save" button
- [ ] Check Firebase Console → Firestore
- [ ] Verify data is saved

### Image Upload Testing
- [ ] In editor, try uploading an image
- [ ] Check Cloudinary dashboard
- [ ] Verify image appears
- [ ] Copy image URL
- [ ] Verify URL works in browser

### Data Sync Testing
- [ ] Make changes in editor
- [ ] Save changes
- [ ] Open portfolio in new tab
- [ ] Verify changes appear
- [ ] Check real-time sync

## 📊 Data Migration

- [ ] Decide migration method (manual or automated)
- [ ] If automated, prepare migration script
- [ ] Run migration
- [ ] Verify all data in Firestore
- [ ] Check all images in Cloudinary
- [ ] Test portfolio with new data

## 🚀 Deployment

### Vercel Setup
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Run `vercel login`
- [ ] Run `vercel`
- [ ] Add environment variables in Vercel dashboard:
  - [ ] `VITE_CLOUDINARY_CLOUD_NAME`
  - [ ] `VITE_CLOUDINARY_UPLOAD_PRESET`
  - [ ] `EMAIL_USER`
  - [ ] `EMAIL_PASS`
  - [ ] `EMAIL_TO`
- [ ] Deploy: `vercel --prod`
- [ ] Test production URL

### Post-Deployment
- [ ] Test admin login on production
- [ ] Test editor on production
- [ ] Test image uploads on production
- [ ] Test contact form
- [ ] Test all apps
- [ ] Check mobile responsiveness

## 🔐 Security

- [ ] Verify `.env` is in `.gitignore`
- [ ] Never commit `.env` file
- [ ] Firestore rules are set correctly
- [ ] Storage rules are set correctly
- [ ] Admin credentials are secure
- [ ] Environment variables set in Vercel

## 📝 Documentation

- [ ] Read FIREBASE_SETUP.md
- [ ] Read QUICK_START.md
- [ ] Read README.md
- [ ] Read CHANGES_SUMMARY.md
- [ ] Understand data structure
- [ ] Know how to use Firebase service
- [ ] Know how to upload images

## 🎯 Final Checks

- [ ] Portfolio loads correctly
- [ ] All apps work
- [ ] Admin login works
- [ ] Editor works
- [ ] Data saves to Firebase
- [ ] Images upload to Cloudinary
- [ ] Contact form sends emails
- [ ] Mobile view works
- [ ] All themes work
- [ ] No console errors

## 🎉 Success Criteria

You're done when:
- ✅ Portfolio is live
- ✅ Admin can login
- ✅ Content can be edited
- ✅ Images can be uploaded
- ✅ Changes reflect immediately
- ✅ No errors in console
- ✅ Mobile works perfectly

## 🆘 Troubleshooting

If something doesn't work:
1. Check this checklist again
2. Read error messages carefully
3. Check browser console
4. Check Firebase Console
5. Verify environment variables
6. Clear browser cache
7. Restart dev server
8. Check documentation files

## 📞 Support

If you're still stuck:
1. Check Firebase Console for errors
2. Check Cloudinary dashboard
3. Check Vercel logs
4. Review all documentation
5. Check browser network tab
6. Verify all credentials

---

## 🎊 Completion

Once all items are checked:
- [ ] Take a screenshot of working portfolio
- [ ] Save admin credentials securely
- [ ] Bookmark admin login URL
- [ ] Share portfolio with friends
- [ ] Celebrate! 🎉

**Your portfolio is now live and database-powered!**

---

**Estimated Time:** 15-30 minutes
**Difficulty:** Easy to Medium
**Prerequisites:** Basic understanding of web development

Good luck! 🚀
