import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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
export const db = getFirestore(app);
export const storage = getStorage(app);
