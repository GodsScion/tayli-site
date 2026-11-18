import { defineConfig } from "vite";

// Two pages: the home page and GitHub Pages' 404.
export default defineConfig({
  build: {
    rollupOptions: { input: { main: "index.html", notFound: "404.html" } },
  },
});
