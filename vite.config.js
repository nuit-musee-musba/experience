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
  build: {
    outDir,
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: "./src/index.html",
        "experience-template":
          "./src/experiences/experience-template/index.html",
        "1-batiment": "./src/experiences/1-batiment/index.html",
        "2-arts-graphiques": "./src/experiences/2-arts-graphiques/index.html",
        "6-peinture": "./src/experiences/6-peinture/index.html",
        "6-peinture/game": "./src/experiences/6-peinture/game.html",
        "3-sculpture": "./src/experiences/3-sculpture/index.html",
        "4-lumiere": "./src/experiences/4-lumiere/index.html",
        "4-lumiere/first-painting":
          "./src/experiences/4-lumiere/first-painting.html",
        "4-lumiere/second-painting":
          "./src/experiences/4-lumiere/second-painting.html",
        "4-lumiere/third-painting":
          "./src/experiences/4-lumiere/third-painting.html",
      },
    },
  },
});
