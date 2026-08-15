import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initLogger } from "./logger";
import { ErrorBoundary } from "./components/ErrorBoundary";

initLogger();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('Service Worker registration failed:', error);
    });
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
