import { src, dest } from 'gulp';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import autoPrefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import cleanCss from 'gulp-clean-css';
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';

const sassAll = gulpSass(sass);

export const styles = () => {
	return src('app/scss/**/*.*{css,scss}')
		.pipe(plumber())
		.pipe(sassAll())
		.pipe(autoPrefixer())
		.pipe(concat('style.min.css'))
		.pipe(cleanCss({ compatibility: 'ie8' }))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream());
};
