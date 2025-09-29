import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // environment: "jsdom",
    projects: [
      {
        extends: "./vitest.config.ts",
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.{test,spec}.{js,ts}"],
          exclude: ["src/**/*.int.{test,spec}.{js,ts}"],
        },
      },
      {
        extends: "./vitest.config.ts",
        test: {
          name: "integration",
          environment: "node",
          include: ["src/**/*.int.{test,spec}.{js,ts}"],
          exclude: [],
        },
      },
    ],
  },
});
