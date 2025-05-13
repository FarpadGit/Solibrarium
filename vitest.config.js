import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    mockReset: true,
    setupFiles: "./test/utils/setupMocks.js",
    alias: {
        "@/": path.resolve(__dirname, "./") + "/"
    },
    // silent: "passed-only"
  },
});
