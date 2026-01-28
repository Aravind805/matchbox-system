// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAR9zi7wWsNILGgshi_Yn9D2-cITedxGsQ",
  authDomain: "matchbox-system.firebaseapp.com",
  projectId: "matchbox-system",
  storageBucket: "matchbox-system.appspot.com", // ✅ FIXED
  messagingSenderId: "172077054940",
  appId: "1:172077054940:web:4f1c28bfa982835af9ed19",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
