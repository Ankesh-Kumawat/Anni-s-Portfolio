import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Auto-apply 80% zoom on desktop (1024px+)
if (window.innerWidth >= 1024) {
    document.body.style.zoom = "80%";
}

createRoot(document.getElementById("root")!).render(
    <div id="scale-root">
        <App />
    </div>
);
