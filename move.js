'use strict'
import { src, dest, series, parallel } from 'gulp';
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
import rename from 'gulp-rename';
import svgSprite from 'gulp-svg-sprite';
import fs from 'fs';
import newer from 'gulp-newer';
import gulpFonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';
import include from 'gulp-file-include';

const dist = 'dist/';
const sassAll = gulpSass(sass);

function img() {
  return src(['app/img/**/*.*', '!app/img/svg/*.svg'], { encoding: false })

    .pipe(newer('app/img/minimized'))
    .pipe(imagemin([mozjpeg(), optipng(), svgo()]))
    .pipe(dest('app/img/minimized'))

    // .pipe(newer('app/dist/img/avif'))
    // .pipe(imagemin([imageminAvif({ quality: 80 })]))
    // .pipe(rename(function (path) {
    //   path.extname = '.avif';
    // }))
    // .pipe(dest('app/dist/img/avif'))

    // .pipe(newer('app/dist/img/webp'))
    // .pipe(imagemin([imageminWebp({ quality: 80 })]))
    // .pipe(rename(function (path) {
    //   path.extname = '.webp';
    // }))
    // .pipe(dest('app/dist/img/webp'))
}

function includeFile() {
  return src('app/pages/**/*.*')
    .pipe(include({
      prefix: '@',
      basepath: 'app'
    }))
    .pipe(dest('./app'))
}

function fonts() {
  return src(['app/fonts/src/**/*.*'], {
    encoding: false
  })
    .pipe(gulpFonter({
      formats: ['woff', 'ttf']
    }))
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'));
}

function svg() {
  return src('app/img/src/svg/**/*.svg')
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
          example: true,
        }
      }
    }))
    .pipe(dest('app/img'))
}

function styles() {
  return src('app/scss/**/*.scss')
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
  watch(['app/js/**/*.js'], scripts);
  watch(['app/img/src/**/*.{png,jpg,jpeg,webp,avif}'], img);
  watch(['app/img/src/svg/**/*.svg'], svg);
  watch(['app/fonts/**/.*'], fonts);
  watch(['app/components/**/*.html', 'app/pages/**/*.html'], includeFile);
  watch(['app/*.html']).on('change', browserSync.reload);
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
    'app/dist/img/**/*.*',
    '!app/img/svg/**/*.svg',
    '!app/dist/img/svg/stack/**/*.*',
    'app/dist/img/svg/sprite.svg',
    'app/fonts/**/*.*',
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

export { styles, scripts, browserUpdate, cleanDist, building, build, img, svg, fonts, includeFile };

export default series(parallel(styles, scripts, svg, img, includeFile, browserUpdate));