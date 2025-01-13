'use strict'

import { src, dest, series, parallel } from 'gulp';

import { svg } from './gulp/tasks/svg.js';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { img } from './gulp/tasks/img.js';
import { build } from './gulp/tasks/build.js';
import { browserUpdate } from './gulp/tasks/browserUpdate.js';
import { fonts } from './gulp/tasks/fonts.js';


export { styles, scripts, browserUpdate, img, svg, fonts, build };

export default series(parallel(styles, scripts, img, svg, fonts, browserUpdate));