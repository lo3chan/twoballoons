import { invoke } from "@tauri-apps/api/core";

export function initLogger() {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  async function forwardLog(level: string, ...args: any[]) {
    const message = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
    try {
      await invoke("log_to_file", { level, message });
    } catch (_) {
      // ignore if tauri invoke not available
    }
  }

  console.log = (...args) => {
    originalLog(...args);
    forwardLog("INFO", ...args);
  };

  console.warn = (...args) => {
    originalWarn(...args);
    forwardLog("WARN", ...args);
  };

  console.error = (...args) => {
    originalError(...args);
    forwardLog("ERROR", ...args);
  };

  window.addEventListener("error", (event) => {
    forwardLog("UNCAUGHT_ERROR", event.message, event.filename, event.lineno, event.colno, event.error?.stack);
  });

  window.addEventListener("unhandledrejection", (event) => {
    forwardLog("UNHANDLED_REJECTION", event.reason?.message || String(event.reason), event.reason?.stack);
  });

  console.log("Twoballoons Frontend Diagnostic Logger Initialized.");
}
