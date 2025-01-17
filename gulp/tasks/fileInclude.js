import { src, dest } from 'gulp';
import include from 'gulp-file-include';

export const fileInclude = () =>  {
  return src('app/pages/**/*.*')
    .pipe(include({
      prefix: '@',
      basepath: 'app'
    }))
    .pipe(dest('./app'))
}