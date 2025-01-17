import { src, dest } from 'gulp';
import include from 'gulp-file-include';
import plumber from 'gulp-plumber';

export const fileInclude = () => {
	return src('app/pages/**/*.*')
		.pipe(plumber())
		.pipe(
			include({
				prefix: '@',
				basepath: 'app',
			})
		)
		.pipe(dest('./app'));
};
