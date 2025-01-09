import gulp from 'gulp';
import watch from 'gulp-watch';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import cleanCss from 'gulp-clean-css';
import autoPrefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean';
import fs from 'fs';
import webp from 'gulp-webp';
import avif from 'gulp-avif';
import imagemin from 'gulp-imagemin';
import cached from 'gulp-cached';

const dist = 'dist/';

function images() {
  return gulp.src(['app/img/*.*', '!app/img/svg/.*svg'])
    .pipe(avif({quality:90}))
    .pipe(gulp.dest('app/img/dist'))
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
  ], { base: 'app' }).pipe(gulp.dest(dist));
}

async function build() {
  try {
    await cleanDist();
    await building();
  } catch (err) {
    console.error(err);
  }
}

export { styles, scripts, watcher, cleanDist, building, build, images };

export default gulp.series(gulp.parallel(images, styles, scripts, watcher));