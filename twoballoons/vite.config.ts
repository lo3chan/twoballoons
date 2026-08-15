/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/pixi.js')) {
            return 'pixi';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@monaco-editor')) {
            return 'monaco';
          }
          if (id.includes('node_modules/yjs') || id.includes('node_modules/y-websocket')) {
            return 'yjs-vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1500
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    globals: true,
    exclude: ["tests/e2e*", "node_modules/**"],
  },
});
