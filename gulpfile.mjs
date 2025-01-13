'use strict'

import { src, dest, series, parallel } from 'gulp';

import { svg } from './gulp/tasks/svg.js';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { img } from './gulp/tasks/img.js';
import { build } from './gulp/tasks/build.js';

import watch from 'gulp-watch';
import browserSync from 'browser-sync';


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

export { styles, scripts, browserUpdate, img, svg, build };

export default series(parallel(styles, scripts, browserUpdate));