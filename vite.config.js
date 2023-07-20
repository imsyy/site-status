import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        pure_funcs: ["console.log"],
      },
    },
    sourcemap: false,
  },
});
