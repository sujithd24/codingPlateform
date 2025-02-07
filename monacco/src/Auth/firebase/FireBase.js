// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqnFUVJ9_jE1gfdHeXM95z1-gJgmZL8pA",
  authDomain: "tryfirebase-b2dc0.firebaseapp.com",
  databaseURL: "https://tryfirebase-b2dc0-default-rtdb.firebaseio.com",
  projectId: "tryfirebase-b2dc0",
  storageBucket: "tryfirebase-b2dc0.firebasestorage.app",
  messagingSenderId: "485658468567",
  appId: "1:485658468567:web:524c33abc3b959fe571092",
  measurementId: "G-FT8ZCKCR0Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();