'use strict'

import { src, dest, series, parallel } from 'gulp';

import { svg } from './gulp/tasks/svg.js';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { img } from './gulp/tasks/img.js';

import watch from 'gulp-watch';
import browserSync from 'browser-sync';
import clean from 'gulp-clean';
import fs from 'fs';

const dist = 'dist/';

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