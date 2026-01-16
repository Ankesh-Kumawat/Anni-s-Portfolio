# 🖥️ Portfolio OS - Interactive Developer Portfolio

A fully interactive portfolio website that simulates a complete operating system experience in the browser, powered by Firebase and Cloudinary.

![Portfolio OS](https://img.shields.io/badge/Portfolio-OS-blue)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Firebase](https://img.shields.io/badge/Firebase-Connected-orange)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Integrated-blue)

## ✨ Features

### 🎨 OS Experience
- **Desktop Environment** - Draggable icons, resizable windows
- **Taskbar** - App launcher with live previews
- **System Tray** - Widgets, notifications, system controls
- **Start Menu** - Search and launch applications
- **Window Management** - Minimize, maximize, close with animations
- **Mobile Responsive** - Full-screen app view on mobile

### 📱 Applications (12 Total)
1. **About Me** - Personal information and bio
2. **Projects** - Portfolio showcase with detailed case studies
3. **Terminal** - Interactive command-line interface
4. **Settings** - Theme switcher, brightness, volume controls
5. **VS Code** - Code editor simulation
6. **Browser** - Web browser interface
7. **Notepad** - Text editor with save functionality
8. **Gallery** - Image gallery with drag-drop organization
9. **Contact** - Contact form with email integration
10. **X-Audio** - Music player with Firebase integration
11. **YouTube** - Video player
12. **Database** - Database viewer

### 🎨 Theming System
- 10 custom themes (5 dark + 5 light)
- Brightness control with Night Shift
- System-wide volume control
- Taskbar behavior customization

### 🔥 Firebase Integration
- **Authentication** - Secure admin login
- **Firestore** - Real-time database for all content
- **Storage** - File storage for assets
- **Real-time Sync** - Changes reflect instantly

### ☁️ Cloudinary Integration
- **Image Upload** - Direct image uploads
- **CDN Delivery** - Fast image loading
- **Automatic Optimization** - Responsive images

### 🔐 Admin Panel
- **Protected Route** - Secure editor access
- **Live Editor** - Update content in real-time
- **Image Management** - Upload and organize images
- **Data Management** - CRUD operations for all content

## 🚀 Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS v4** - Utility-first CSS
- **Shadcn/ui** - Beautiful UI components
- **Wouter** - Lightweight routing
- **React Query** - Data fetching and caching

### Backend
- **Express.js** - Node.js server
- **Nodemailer** - Email service
- **Firebase** - Backend as a Service
- **Cloudinary** - Image management

### State Management
- **React Context API** - Global state
- Multiple providers for different features

### Deployment
- **Vercel** - Serverless deployment
- **Firebase Hosting** - Alternative hosting

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio-os.git

# Navigate to project
cd portfolio-os

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

## 🔧 Configuration

### 1. Firebase Setup
See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

Quick steps:
1. Create Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Set security rules
5. Create admin account

### 2. Cloudinary Setup
1. Create Cloudinary account
2. Get Cloud Name and Upload Preset
3. Add to `.env`:
```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### 3. Email Configuration
For contact form:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=recipient@gmail.com
```

## 🎯 Usage

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

### Admin Access
1. Navigate to `/admin-login`
2. Login with Firebase credentials
3. Access editor at `/editor`

## 📁 Project Structure

```
portfolio-os/
├── client/
│   ├── public/
│   │   ├── assets/
│   │   └── data/          # Legacy JSON data
│   └── src/
│       ├── components/
│       │   ├── apps/      # Application components
│       │   ├── os/        # OS components
│       │   └── ui/        # UI components
│       ├── hooks/         # Custom hooks
│       ├── lib/           # Utilities and services
│       │   ├── firebase.ts
│       │   ├── firebase-service.ts
│       │   ├── cloudinary.ts
│       │   └── auth-context.tsx
│       ├── pages/         # Page components
│       │   ├── editor/    # Admin editor
│       │   └── admin-login.tsx
│       └── App.tsx
├── server/
│   ├── index.ts
│   ├── routes.ts
│   └── email-template-generator.ts
└── shared/
    └── schema.ts
```

## 🔐 Security

- ✅ Protected admin routes
- ✅ Firebase Authentication
- ✅ Firestore security rules
- ✅ Environment variables for secrets
- ✅ HTTPS only in production

## 🌐 Deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

### Firebase Hosting
```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy
```

## 📝 Data Migration

To migrate from JSON to Firebase:

```typescript
import { saveAllData } from './lib/firebase-service';

const data = {
  about: require('./public/data/about.json'),
  projects: require('./public/data/projects.json'),
  contact: require('./public/data/contact.json'),
  // ... etc
};

await saveAllData(data);
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own portfolio!

## 👨‍💻 Author

**Ankesh Kumawat (Anni)**
- Email: ankeshkumawat155@gmail.com
- Location: Sikar, Rajasthan, India

## 🙏 Acknowledgments

- Shadcn/ui for beautiful components
- Firebase for backend infrastructure
- Cloudinary for image management
- Vercel for hosting

---

**Built with ❤️ using React, TypeScript, Firebase, and Cloudinary**

For detailed setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
