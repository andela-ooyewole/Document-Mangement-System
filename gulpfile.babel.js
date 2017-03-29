/* eslint-disable */
import gulp from 'gulp';
import shell from 'gulp-shell';
/* eslint-enable */

gulp.task('start', shell.task([
  'nodemon server/app.js --exec babel-node'
]));

gulp.task('test', shell.task([
  'NODE_ENV=test babel-node ./node_modules/babel-istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha server/tests/api/user.spec.js'
]));

gulp.task('coveralls', shell.task([
  'npm run test -- --report lcovonly && cat ./coverage/lcov.info | coveralls'
]));

gulp.task('db:init', shell.task([
  './node_modules/.bin/sequelize db:migrate',
  './node_modules/.bin/sequelize db:seed --seed=20170329104556-role.js',
  './node_modules/.bin/sequelize db:seed --seed=20170329101026-user.js'
]));

gulp.task('default', ['start']);
