import { src, dest, series } from 'gulp';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

function woff() {
  return src(['app/fonts/src/**/*.*'], { encoding: false })
    .pipe(fonter({
      formats: ['woff']
    }))
    .pipe(dest('app/fonts'))
}

function woff2() {
  return src(['app/fonts/*.woff'], { encoding: false })
    .pipe(ttf2woff2({ ignoreExt: true }))
    .pipe(dest('app/fonts'))
}

export const fonts = series(woff, woff2);