'use strict';

import gulp from 'gulp';
import shell from 'gulp-shell';

gulp.task('start', shell.task([
  'nodemon server/app.js --exec babel-node'
]));

gulp.task('default', ['start']);
