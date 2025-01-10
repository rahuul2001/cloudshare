// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUr8ceKlLoGTMVONHP-rJsl7dvAynhURg",
  authDomain: "file-sharing-app-50977.firebaseapp.com",
  projectId: "file-sharing-app-50977",
  storageBucket: "file-sharing-app-50977.firebasestorage.app",
  messagingSenderId: "1008139132995",
  appId: "1:1008139132995:web:abfd744569fe821eef34f6",
  measurementId: "G-6RMLSM6CYR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)