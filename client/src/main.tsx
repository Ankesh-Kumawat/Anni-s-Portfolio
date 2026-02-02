import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 🔥 Unregister any existing service workers (causing cache issues)
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
            registration.unregister();
            console.log("Service Worker unregistered");
        });
    });
}

// Auto-apply 80% zoom on desktop (1024px+)
if (window.innerWidth >= 1024) {
    document.body.style.zoom = "80%";
}

createRoot(document.getElementById("root")!).render(
    <div id="scale-root">
        <App />
    </div>
);
