/* eslint-disable */
import express from 'express';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import logger from 'morgan';
import path from 'path';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import Routes from './routes';
import config from '../webpack.config';
/* eslint-enable */

// Set up the express app
const app = express();
const router = express.Router();
const compiler = webpack(config);

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve and receive requests with express router
app.use('/', router);
app.set('port', process.env.PORT || 3000);

// Default route
app.route('/').get((req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Require API Endpoint routes into the application.
Routes(app);

app.use(webpackMiddleware(compiler, {
  hot: true,
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));


app.listen(app.get('port')); // Application listening on port 3000!

// Expose the server for supertest to use
export default app;
