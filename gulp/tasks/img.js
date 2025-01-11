import { src, dest } from 'gulp';
import newer from 'gulp-newer';
import imagemin, { mozjpeg, optipng } from 'gulp-imagemin';
import imageminAvif from 'imagemin-avif';
import imageminWebp from 'imagemin-webp';
import rename from 'gulp-rename';

export const img = () => {
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