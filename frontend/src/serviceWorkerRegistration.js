// src/serviceWorkerRegistration.js

export function register() {
  if (process.env.NODE_ENV !== "production") {
    console.log("ℹ️ Service worker skipped (dev mode)");
    return;
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => {
          console.log("✅ Service Worker registered (production)");
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    });
  }
}
