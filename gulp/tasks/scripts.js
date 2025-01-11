import { src, dest } from 'gulp';
import terser from 'gulp-terser';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';

export const scripts = () => {
  return src('app/js/src/main.js')
    .pipe(concat('main.min.js'))
    .pipe(terser())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}