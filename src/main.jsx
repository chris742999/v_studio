import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />

    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#0B1120",
          color: "#fff",
          border: "1px solid rgba(34,211,238,.4)",
          borderRadius: "16px",
          backdropFilter: "blur(20px)",
        },
      }}
    />
  </StrictMode>
);