'use strict'

import {src, dest, series, parallel } from 'gulp';
import watch from 'gulp-watch';
import gulpSass from 'gulp-sass';
import * as sass from 'sass'
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import cleanCss from 'gulp-clean-css';
import autoPrefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean';
import imagemin, { optipng, mozjpeg, svgo } from 'gulp-imagemin';
import imageminAvif from 'imagemin-avif';
import imageminWebp from 'imagemin-webp';
import svgSprite from 'gulp-svg-sprite';
import fs from 'fs';
import rename from 'gulp-rename';
import newer from 'gulp-newer';

const dist = 'dist/';
const sassAll = gulpSass(sass);

function img() {
  return src(['app/img/src/**/*.*', '!app/img/src/svg/*.svg'], { encoding: false })
    
    .pipe(newer('app/img/minimized'))
    .pipe(imagemin([mozjpeg(), optipng()]))
    .pipe(dest('app/img/minimized'))
    
    .pipe(newer('app/img/avif'))
    .pipe(imagemin([imageminAvif({ quality: 80 })]))
    .pipe(rename(function (path) {
      path.extname = '.avif';
    }))
    .pipe(dest('app/img/avif'))

    .pipe(newer('app/img/webp'))
    .pipe(imagemin([imageminWebp({ quality: 80 })]))
    .pipe(rename(function (path) {
      path.extname = '.webp';
    }))
    .pipe(dest('app/img/webp'))
}

function svg() {
  return src('app/img/src/svg/*.svg')
    .pipe(imagemin([svgo()]))
    .pipe(svgSprite({
      shape: {
        dimension: {
          maxHeight: 50,
          maxWidth: 50
        }
      },
      mode: {
        stack: {
          sprite: '../sprite.svg',
        }
      }
    }))
    .pipe(dest('app/img'))
}

function styles() {
  return src('app/scss/**/*.*{css,scss}')
    .pipe(sassAll())
    .pipe(autoPrefixer())
    .pipe(concat('style.min.css'))
    .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return src('app/js/src/main.js')
    .pipe(concat('main.min.js'))
    .pipe(terser())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
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
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/src/**/*.js'], scripts);
  watch(['app/img/src/**/*.*'], img);
  watch(['app/img/src/svg/**/*.svg'], svg);
  watch(['app/**/*.html']).on('change', browserSync.reload);
}

function cleanDist() {
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist, { recursive: true });
  }
  return src(`${dist}/**/*`, { read: false }).pipe(clean());
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/img/**/*.*',
    '!app/img/src/**/*.*',
    'app/**/*.html'
  ], { base: 'app' }).pipe(dest(dist))
}

async function build() {
  try {
    await cleanDist();
    await building();
  } catch (err) {
    console.error(err);
  }
}

export { styles, scripts, browserUpdate, cleanDist, building, build, img, svg };

export default series(parallel(styles, scripts, browserUpdate));