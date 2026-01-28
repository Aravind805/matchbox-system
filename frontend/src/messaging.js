import { messaging } from "./firebase";
import { getToken, deleteToken } from "firebase/messaging";

export async function enableNotifications() {
  try {
    // 🔥 FORCE DELETE OLD TOKEN
    //await deleteToken(messaging);
    console.log("🧹 Old FCM token deleted");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("❌ Notification permission denied");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: "BFXoHGli4vJotfQ9EXijTB1NuF1uWIoe6it6SNCYgoTi9C5M7Pa6nrV9vnG7SnqwwJr5uGVZUMQhz9Zx1lnrrC4",
    });

    console.log("🔥 NEW FCM TOKEN:", token);

    await fetch("http://localhost:5000/api/register-fcm-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    console.log("✅ New token sent to backend");
  } catch (err) {
    console.error("❌ Error enabling notifications", err);
  }
}

