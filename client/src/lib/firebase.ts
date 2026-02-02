import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwiua4pkYSiRsGGAJZukS25VmeAFSJfzs",
  authDomain: "anni--portfolio.firebaseapp.com",
  projectId: "anni--portfolio",
  storageBucket: "anni--portfolio.firebasestorage.app",
  messagingSenderId: "309577707643",
  appId: "1:309577707643:web:8b2bccb636969d24fcf2de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 🔥 Initialize Firestore WITHOUT offline persistence for real-time accuracy
export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});

export const storage = getStorage(app);
