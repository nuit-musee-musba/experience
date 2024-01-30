import * as fs from "fs";
import { join, resolve } from "path";
import { defineConfig } from "vite";
const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

// plugin
const redirectToDir = ({ root }) => ({
  name: "redirect-to-dir",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const filePath = join(root, req.url);

      fs.stat(filePath, (err, stats) => {
        if (!err && stats.isDirectory() && !req.url.endsWith("/")) {
          res.statusCode = 301;
          res.setHeader("Location", req.url + "/");
          res.setHeader("Content-Length", "0");
          res.end();
          return;
        }

        next();
      });
    });
  },
});

export default defineConfig({
  root,
  publicDir: "../static/",
  plugins: [redirectToDir({ root })],
  base: "./",
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    outDir,
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: "./src/index.html",
        "experience-template":
          "./src/experiences/experience-template/index.html",
      },
    },
  },
});
