/* eslint-disable */
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import Routes from './routes';
/* eslint-enable */

// Set up the express app
const app = express();
const router = express.Router();

app.use(cors());

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve and receive requests with express router
app.use('/', router);
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port')); // Application listening on port 3000!

// Require our routes into the application.
Routes(app);

// Expose the server for supertest to use
export default app;
