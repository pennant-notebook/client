import react from "@vitejs/plugin-react";
import path from "path";
import Fonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";

const cmPackages = [
  "state",
  "view",
  "autocomplete",
  "commands",
  "lang-javascript",
  "lang-python",
  "search",
  "lint",
  "draw",
];

export default defineConfig({
  plugins: [
    react(),
    Fonts({
      google: {
        families: ["Lato", "Inter", "Fira Code"],
      },
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "./src/types"),
      // Force all @codemirror/* to the same node_modules copy:
      ...cmPackages.reduce((aliases, pkg) => {
        aliases[`@codemirror/${pkg}`] = path.resolve(__dirname, `node_modules/@codemirror/${pkg}`);
        return aliases;
      }, {}),
    },
  },
  assetsInclude: ["**/*.mp4", "**/*.md"],
});
