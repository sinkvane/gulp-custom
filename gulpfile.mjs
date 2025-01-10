'use strict'

import gulp from 'gulp';
import watch from 'gulp-watch';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import cleanCss from 'gulp-clean-css';
import autoPrefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean';
import imagemin, { optipng, mozjpeg, svgo } from 'gulp-imagemin';
import imageminAvif from 'imagemin-avif';
import imageminWebp from 'imagemin-webp';
import fs from 'fs';
import rename from 'gulp-rename';
import newer from 'gulp-newer';

const dist = 'dist/';

function img() {
  return gulp.src(['app/img/**/*.*', '!app/img/svg/*.svg'], { encoding: false })
    
    .pipe(newer('app/dist/img/minimized'))
    .pipe(imagemin([mozjpeg(), optipng(), svgo()]))
    .pipe(gulp.dest('app/dist/img/minimized'))
    
    .pipe(newer('app/dist/img/avif'))
    .pipe(imagemin([imageminAvif({ quality: 80 })]))
    .pipe(rename(function (path) {
      path.extname = '.avif';
    }))
    .pipe(gulp.dest('app/dist/img/avif'))

    .pipe(newer('app/dist/img/webp'))
    .pipe(imagemin([imageminWebp({ quality: 80 })]))
    .pipe(rename(function (path) {
      path.extname = '.webp';
    }))
    .pipe(gulp.dest('app/dist/img/webp'))
}

function styles() {
  return gulp.src('app/scss/style.scss')
    .pipe(autoPrefixer())
    .pipe(concat('style.min.css'))
    .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src('app/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(terser())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream());
}

function watcher() {
  watch(['app/**/*.scss'], styles);
  watch(['app/img/**/*.*'], img);
  watch(['app/**/*.js'], scripts);
  watch(['app/**/*.html']).on('change', browserSync.reload);
}

function browserUpdate() {
  browserSync.init({
    server: {
      baseDir: "app",
    },
    port: 8080,
    notify: false,
    open: true,
  });
  watch(['app/**/*.scss'], styles);
  watch(['app/**/*.js'], scripts);
  watch(['app/**/*.html']).on('change', browserSync.reload);
}

function cleanDist() {
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist, { recursive: true });
  }
  return gulp.src(`${dist}/**/*`, { read: false }).pipe(clean());
}

function building() {
  return gulp.src([
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/**/*.html',
  ], { base: 'app' }).pipe(gulp.dest(dist))
}

async function build() {
  try {
    await cleanDist();
    await building();
  } catch (err) {
    console.error(err);
  }
}

export { styles, scripts, watcher, browserUpdate, cleanDist, building, build, img };

export default gulp.series(gulp.parallel(images, styles, scripts, watcher));