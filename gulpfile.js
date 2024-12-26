import gulp, { dest } from 'gulp';
import watch from 'gulp-watch';
import browserSync from 'browser-sync';
import inject from 'gulp-inject';
import gulpSass from 'gulp-sass';
import * as sass from 'sass'
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import cleanCss from 'gulp-clean-css';

const src = 'src/';
const dist = 'dist/';
const sassAll = gulpSass(sass);

function styles() {
  return gulp.src('app/scss/style.scss')
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
  watch(['app/scss/style.scss'], styles)
  watch(['app/js/main.js'], scripts)
  watch(['app/*.html']).on('change', browserSync.reload)
}

function browserUpdate() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
}

function injection() {
  const sources = gulp.src(['app/js/*.js', 'app/scss/style.scss'], { read: false });
  return gulp.src('app/index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('dist'))
}

export { styles, scripts, watcher, browserUpdate, injection }

export default gulp.task('default', gulp.series(gulp.parallel(styles, scripts, browserSync, injection, watcher)))