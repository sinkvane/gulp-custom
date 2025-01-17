import watch from 'gulp-watch';
import browserSync from 'browser-sync';
import { styles } from './styles.js';
import { scripts } from './scripts.js';
import { img } from './img.js';
import { svg } from './svg.js';
import { fonts } from './fonts.js';
import { fileInclude } from './fileInclude.js';

export const browserUpdate = () => {
	browserSync.init({
		server: {
			baseDir: 'app',
		},
		port: 8080,
		notify: false,
		open: true,
	});
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/js/src/**/*.js'], scripts);
	watch(['app/fonts/src/**/*.*'], fonts);
	watch(['app/img/src/**/*.*'], img);
	watch(['app/img/src/svg/**/*.svg'], svg);
	watch(['app/pages/**/*.html'], fileInclude);
	watch(['app/components/**/*.html'], fileInclude);
	watch(['app/**/*.html']).on('change', browserSync.reload);
};
