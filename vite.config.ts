/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: [
      // Necessary because Amplify sucks ass.
      {
        find: "./runtimeConfig",
        replacement: "./runtimeConfig.browser",
      },
    ],
  },
  envPrefix: "REACT_APP_",
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis", //<-- AWS SDK
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/utils/setup-test.ts",
  },
});
