"use strict";

// Include Gulp & Tools We"ll Use
var gulp = require("gulp"),
    webserver = require('gulp-webserver'),
    uglify = require("gulp-uglify"),
    changed = require("gulp-changed"),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS = require("gulp-minify-css"),
    size = require("gulp-size"),
    concat = require("gulp-concat"),
    imagemin = require("gulp-imagemin"),
    autoprefixer = require("gulp-autoprefixer"),
    jshint = require("gulp-jshint"),
    stylish = require("jshint-stylish"),
    less = require("gulp-less"),
    sass = require("gulp-sass"),
    minifyHTML = require("gulp-minify-html"),
    glob = require("glob"),
    uncss = require("gulp-uncss"),
    opts = {
        path: function(path) { return __dirname + (path.charAt(0) === "/" ? "" : "/") + path; },
        uncss: { html: glob.sync("layouts/**/*.html") },
        size: { showFiles: true, gzip: true },
        html: { empty: true },
        autoprefixer: { browsers: ['last 2 versions'], cascade: true },
        css: { keepBreaks: false },
        webserver: {
            livereload: true,
            directoryListing: false,
            open: false,
            fallback: "404.html"
        }
    };

gulp.task("jshint", function () {
    return gulp.src("src/js/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task("images", function () {
    return gulp.src("src/img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("static/img"))
        .pipe(size(opts.size));
});

gulp.task("html", function() {

    var SRC = opts.path("src/html/**/*.html"),
        DEST = opts.path("app");

    gulp.src(SRC)
        .pipe(changed(DEST))
        .pipe(minifyHTML(opts.html))
        .pipe(gulp.dest(DEST));
});

gulp.task("less", function () {

    var SRC = opts.path("src/less/**/*.less"),
        DEST = opts.path("src/css");

    return gulp.src(SRC)
        .pipe(less())
        .pipe(gulp.dest(DEST));

});

gulp.task("sass", function() {
    var SRC = opts.path("src/sass/**/*.scss"),
        DEST = opts.path("src/css");

    gulp.src(SRC)
        .pipe(sass())
        .pipe(gulp.dest(DEST));
});

gulp.task("css", function() {

    var SRC = opts.path("src/css/**/*.css"),
        DEST = opts.path("static/css");

    gulp.src(SRC)
        .pipe(autoprefixer(opts.autoprefixer))
        .pipe(concat("site.css"))
        .pipe(uncss(opts.uncss))
        .pipe(minifyCSS(opts.css))
        .pipe(gulp.dest(DEST))
        .pipe(size(opts.size));

});

gulp.task("js:all", function() {
    var SRC = opts.path("src/js/**/*.js"),
        DEST = opts.path("static/js");

    gulp.src(SRC)
        .pipe(uglify())
        .pipe(gulp.dest(DEST));

});

gulp.task("test", ["jshint"]);

gulp.task("watch", function () {
    gulp.watch(["src/html/**/*.html"], ["html"]);
    gulp.watch(["src/css/**/*.css"], ["css"]);
    gulp.watch(["src/less/**/*.less"], ["less"]);
    gulp.watch(["src/sass/**/*.scss"], ["sass"]);
    gulp.watch(["src/js/**/*.jade"], ["js:all"]);
    gulp.watch(["src/img/**/*"], ["images"]);
});

gulp.task("build", ["js:all", "less", "sass", "images"]);

gulp.task("default", ["build", "watch"]);
