import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { globSync } from "node:fs";

const entries = Object.fromEntries(
  globSync("src/islands/*.jsx").map((file) => [
    file.split("/").pop().replace(/\.jsx$/, ""),
    resolve(process.cwd(), file)
  ])
);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "public/assets",
    emptyOutDir: true,
    rollupOptions: { input: entries },
    manifest: true
  }
});
