// vite.config.js
import * as fs from "fs";
import { join, resolve } from "path";
import { defineConfig } from "file:///Users/mxtwin/Documents/Projects/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/Users/mxtwin/Documents/Projects/experience";
var root = resolve(__vite_injected_original_dirname, "src");
var outDir = resolve(__vite_injected_original_dirname, "dist");
var redirectToDir = ({ root: root2 }) => ({
  name: "redirect-to-dir",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const filePath = join(root2, req.url);
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
  }
});
var vite_config_default = defineConfig({
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
        "ui-demo": "./src/ui-demo/index.html",
        "1-batiment": "./src/experiences/1-batiment/index.html",
        "2-arts-graphiques": "./src/experiences/2-arts-graphiques/index.html",
        "6-peinture": "./src/experiences/6-peinture/index.html",
        "6-peinture/game": "./src/experiences/6-peinture/game.html",
        "3-sculpture": "./src/experiences/3-sculpture/index.html",
        "4-lumiere": "./src/experiences/4-lumiere/index.html",
        "4-lumiere/first-painting": "./src/experiences/4-lumiere/first-painting.html",
        "4-lumiere/second-painting": "./src/experiences/4-lumiere/second-painting.html",
        "4-lumiere/third-painting": "./src/experiences/4-lumiere/third-painting.html",
        "4-lumiere/results": "./src/experiences/4-lumiere/results.html"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbXh0d2luL0RvY3VtZW50cy9Qcm9qZWN0cy9leHBlcmllbmNlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbXh0d2luL0RvY3VtZW50cy9Qcm9qZWN0cy9leHBlcmllbmNlL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9teHR3aW4vRG9jdW1lbnRzL1Byb2plY3RzL2V4cGVyaWVuY2Uvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IGpvaW4sIHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmNvbnN0IHJvb3QgPSByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIik7XG5jb25zdCBvdXREaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgXCJkaXN0XCIpO1xuXG4vLyBwbHVnaW5cbmNvbnN0IHJlZGlyZWN0VG9EaXIgPSAoeyByb290IH0pID0+ICh7XG4gIG5hbWU6IFwicmVkaXJlY3QtdG8tZGlyXCIsXG4gIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBqb2luKHJvb3QsIHJlcS51cmwpO1xuXG4gICAgICBmcy5zdGF0KGZpbGVQYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgICBpZiAoIWVyciAmJiBzdGF0cy5pc0RpcmVjdG9yeSgpICYmICFyZXEudXJsLmVuZHNXaXRoKFwiL1wiKSkge1xuICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMzAxO1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCByZXEudXJsICsgXCIvXCIpO1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LUxlbmd0aFwiLCBcIjBcIik7XG4gICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJvb3QsXG4gIHB1YmxpY0RpcjogXCIuLi9zdGF0aWMvXCIsXG4gIHBsdWdpbnM6IFtyZWRpcmVjdFRvRGlyKHsgcm9vdCB9KV0sXG4gIGJhc2U6IFwiLi9cIixcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXIsXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46IFwiLi9zcmMvaW5kZXguaHRtbFwiLFxuICAgICAgICBcInVpLWRlbW9cIjogXCIuL3NyYy91aS1kZW1vL2luZGV4Lmh0bWxcIixcbiAgICAgICAgXCIxLWJhdGltZW50XCI6IFwiLi9zcmMvZXhwZXJpZW5jZXMvMS1iYXRpbWVudC9pbmRleC5odG1sXCIsXG4gICAgICAgIFwiMi1hcnRzLWdyYXBoaXF1ZXNcIjogXCIuL3NyYy9leHBlcmllbmNlcy8yLWFydHMtZ3JhcGhpcXVlcy9pbmRleC5odG1sXCIsXG4gICAgICAgIFwiNi1wZWludHVyZVwiOiBcIi4vc3JjL2V4cGVyaWVuY2VzLzYtcGVpbnR1cmUvaW5kZXguaHRtbFwiLFxuICAgICAgICBcIjYtcGVpbnR1cmUvZ2FtZVwiOiBcIi4vc3JjL2V4cGVyaWVuY2VzLzYtcGVpbnR1cmUvZ2FtZS5odG1sXCIsXG4gICAgICAgIFwiMy1zY3VscHR1cmVcIjogXCIuL3NyYy9leHBlcmllbmNlcy8zLXNjdWxwdHVyZS9pbmRleC5odG1sXCIsXG4gICAgICAgIFwiNC1sdW1pZXJlXCI6IFwiLi9zcmMvZXhwZXJpZW5jZXMvNC1sdW1pZXJlL2luZGV4Lmh0bWxcIixcbiAgICAgICAgXCI0LWx1bWllcmUvZmlyc3QtcGFpbnRpbmdcIjpcbiAgICAgICAgICBcIi4vc3JjL2V4cGVyaWVuY2VzLzQtbHVtaWVyZS9maXJzdC1wYWludGluZy5odG1sXCIsXG4gICAgICAgIFwiNC1sdW1pZXJlL3NlY29uZC1wYWludGluZ1wiOlxuICAgICAgICAgIFwiLi9zcmMvZXhwZXJpZW5jZXMvNC1sdW1pZXJlL3NlY29uZC1wYWludGluZy5odG1sXCIsXG4gICAgICAgIFwiNC1sdW1pZXJlL3RoaXJkLXBhaW50aW5nXCI6XG4gICAgICAgICAgXCIuL3NyYy9leHBlcmllbmNlcy80LWx1bWllcmUvdGhpcmQtcGFpbnRpbmcuaHRtbFwiLFxuICAgICAgICBcIjQtbHVtaWVyZS9yZXN1bHRzXCI6IFwiLi9zcmMvZXhwZXJpZW5jZXMvNC1sdW1pZXJlL3Jlc3VsdHMuaHRtbFwiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1ULFlBQVksUUFBUTtBQUN2VSxTQUFTLE1BQU0sZUFBZTtBQUM5QixTQUFTLG9CQUFvQjtBQUY3QixJQUFNLG1DQUFtQztBQUd6QyxJQUFNLE9BQU8sUUFBUSxrQ0FBVyxLQUFLO0FBQ3JDLElBQU0sU0FBUyxRQUFRLGtDQUFXLE1BQU07QUFHeEMsSUFBTSxnQkFBZ0IsQ0FBQyxFQUFFLE1BQUFBLE1BQUssT0FBTztBQUFBLEVBQ25DLE1BQU07QUFBQSxFQUNOLGdCQUFnQixRQUFRO0FBQ3RCLFdBQU8sWUFBWSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7QUFDekMsWUFBTSxXQUFXLEtBQUtBLE9BQU0sSUFBSSxHQUFHO0FBRW5DLE1BQUcsUUFBSyxVQUFVLENBQUMsS0FBSyxVQUFVO0FBQ2hDLFlBQUksQ0FBQyxPQUFPLE1BQU0sWUFBWSxLQUFLLENBQUMsSUFBSSxJQUFJLFNBQVMsR0FBRyxHQUFHO0FBQ3pELGNBQUksYUFBYTtBQUNqQixjQUFJLFVBQVUsWUFBWSxJQUFJLE1BQU0sR0FBRztBQUN2QyxjQUFJLFVBQVUsa0JBQWtCLEdBQUc7QUFDbkMsY0FBSSxJQUFJO0FBQ1I7QUFBQSxRQUNGO0FBRUEsYUFBSztBQUFBLE1BQ1AsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUFBLEVBQ0g7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCO0FBQUEsRUFDQSxXQUFXO0FBQUEsRUFDWCxTQUFTLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQUEsRUFDakMsTUFBTTtBQUFBLEVBQ04sT0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBLGFBQWE7QUFBQSxJQUNiLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE1BQU07QUFBQSxRQUNOLFdBQVc7QUFBQSxRQUNYLGNBQWM7QUFBQSxRQUNkLHFCQUFxQjtBQUFBLFFBQ3JCLGNBQWM7QUFBQSxRQUNkLG1CQUFtQjtBQUFBLFFBQ25CLGVBQWU7QUFBQSxRQUNmLGFBQWE7QUFBQSxRQUNiLDRCQUNFO0FBQUEsUUFDRiw2QkFDRTtBQUFBLFFBQ0YsNEJBQ0U7QUFBQSxRQUNGLHFCQUFxQjtBQUFBLE1BQ3ZCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJyb290Il0KfQo=
