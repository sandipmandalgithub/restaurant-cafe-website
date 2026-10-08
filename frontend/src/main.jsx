import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import CustomerAuthProvider from "./context/CustomerAuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CustomerAuthProvider>
      <App />
    </CustomerAuthProvider>
  </StrictMode>
);