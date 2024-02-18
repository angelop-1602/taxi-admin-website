// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbCl1N_OH0ortcF9zKDrK9Iuh6ynC_Rsg",
  authDomain: "cvkatco-taxi.firebaseapp.com",
  projectId: "cvkatco-taxi",
  storageBucket: "cvkatco-taxi.appspot.com",
  messagingSenderId: "582631469709",
  appId: "1:582631469709:web:b8ccb191fe15924dea28c4",
  measurementId: "G-CVYECJ1JTS"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
