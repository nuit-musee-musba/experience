import { deleteSync } from "del";
import gulp from "gulp";
import zip from "gulp-zip";

gulp.task("createBundleBase", () => {
  return gulp.src(".bundle_files/**/*").pipe(gulp.dest("./bundle/"));
});

gulp.task("copyDistInBundle", () => {
  return gulp.src("dist/**/*").pipe(gulp.dest("./bundle/dist"));
});

gulp.task("zipBundle", () => {
  return gulp
    .src("./bundle/**/*")
    .pipe(zip("bundle.zip"))
    .pipe(gulp.dest("./"));
});

gulp.task("cleanBundle", async () => {
  return deleteSync("bundle");
});

gulp.task("bundle", gulp.series("createBundleBase", "copyDistInBundle"));
gulp.task("bundleZipped", gulp.series("bundle", "zipBundle", "cleanBundle"));
