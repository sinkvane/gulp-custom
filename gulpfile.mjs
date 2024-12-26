import gulp from 'gulp';
import watch from 'gulp-watch';
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import * as sass from 'sass'
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import cleanCss from 'gulp-clean-css';
import autoPrefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean';

const src = 'src/';
const dist = 'dist/';
const sassAll = gulpSass(sass);

function styles() {
  return gulp.src('app/scss/style.scss')
    .pipe(autoPrefixer())
    .pipe(concat('style.min.css'))
    .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream())
}

function scripts() {
  return gulp.src('app/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(terser())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream())
}

function watcher() {
  watch(['app/**/*.scss'], styles)
  watch(['app/**/*.js'], scripts)
  watch(['app/**/*.html']).on('change', browserSync.reload)
}

function browserUpdate() {
  browserSync.init({
    server: {
      baseDir: "app"
    },
    port: 8080,
    notify: false,
    open: true
  });
}

function cleanDist() {
  return gulp.src('dist')
    .pipe(clean())
}

function building() {
  return gulp.src([
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/**/*.html'
  ], { base: 'app' })
    .pipe(gulp.dest(dist))
}

function build() {
  return gulp.series(cleanDist(), building())
}

export { styles, scripts, watcher, browserUpdate, build }

export default gulp.task('default', gulp.series(gulp.parallel(styles, scripts, watcher, browserUpdate)));