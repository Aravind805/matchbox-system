/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAR9zi7wWsNILGgshi_Yn9D2-cITedxGsQ",
  authDomain: "matchbox-system.firebaseapp.com",
  projectId: "matchbox-system",
  storageBucket: "matchbox-system.firebasestorage.app",
  messagingSenderId: "172077054940",
  appId: "1:172077054940:web:4f1c28bfa982835af9ed19",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification?.title || "Matchbox System";
  const notificationOptions = {
    body: payload.notification?.body || "New update received",
    icon: "/logo192.png", // optional
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

