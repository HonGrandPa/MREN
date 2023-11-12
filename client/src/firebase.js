// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mren-40c88.firebaseapp.com",
  projectId: "mren-40c88",
  storageBucket: "mren-40c88.appspot.com",
  messagingSenderId: "613167933158",
  appId: "1:613167933158:web:062727fde62df6d9e77d27",
  measurementId: "G-9L3J47NK5E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);