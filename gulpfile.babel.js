/* eslint-disable */
import gulp from 'gulp';
import shell from 'gulp-shell';
/* eslint-enable */

gulp.task('start', shell.task([
  'babel-node server/app.js'
]));

gulp.task('tests', ['db:migrate'], shell.task([
  'NODE_ENV=test babel-node ./node_modules/babel-istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha server/tests/**/*.spec.js'
]));

gulp.task('test', shell.task([
  'npm run tests -- --report lcovonly && cat ./coverage/lcov.info | coveralls'
]));

gulp.task('db:migrate', ['db:migrate:undo:all'], shell.task([
  './node_modules/.bin/sequelize db:migrate'
]));

gulp.task('db:migrate:undo:all', shell.task([
  './node_modules/.bin/sequelize db:migrate:undo:all'
]));

gulp.task('db:seed', shell.task([
  './node_modules/.bin/sequelize db:seed --seed=20170329104556-role.js',
  './node_modules/.bin/sequelize db:seed --seed=20170329101026-user.js'
]));

gulp.task('default', ['start']);
