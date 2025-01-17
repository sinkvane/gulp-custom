import { src, dest } from 'gulp';
import imagemin, { svgo } from 'gulp-imagemin';
import svgSprite from 'gulp-svg-sprite';
import plumber from 'gulp-plumber';

export const svg = () => {
	return src('app/img/src/svg/*.svg')
		.pipe(plumber())
		.pipe(imagemin([svgo()]))
		.pipe(
			svgSprite({
				shape: {
					dimension: {
						maxHeight: 50,
						maxWidth: 50,
					},
				},
				mode: {
					stack: {
						sprite: '../sprite.svg',
					},
				},
			})
		)
		.pipe(dest('app/img'));
};
