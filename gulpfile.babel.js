/* eslint-disable */
import gulp from 'gulp';
import shell from 'gulp-shell';
/* eslint-enable */

gulp.task('start', shell.task([
  'nodemon server/app.js --exec babel-node',
]));

gulp.task('test', shell.task([
  'mocha server/tests/api/user.spec.js --compilers js:babel-register',
]));

gulp.task('cover', shell.task([
  'babel-node ./node_modules/babel-istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha server/tests/api/user.spec.js',
]));

gulp.task('coveralls', shell.task([
  'npm run cover -- --report lcovonly && cat ./coverage/lcov.info | coveralls'
]));

gulp.task('default', ['start']);
