import { src, dest, series } from 'gulp';
import gulpClean from 'gulp-clean';

const dist = 'dist/';

function cleanDist() {
  return src('dist', { allowEmpty: true })
    .pipe(gulpClean())
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/fonts/*.woff',
    'app/fonts/*.woff2',
    'app/img/**/*.*',
    '!app/img/src/**/*.*',
    'app/**/*.html'
  ], { base: 'app' }).pipe(dest(dist))
}

export const build = series(cleanDist, building);