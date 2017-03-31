/* eslint-disable */
import controller from '../controllers';
/* eslint-enable */

const Routes = (app) => {
  // DEFAULT route
  app
    .route('/')
    .get((req, res) => {
      res.send('Document Management System');
    });

  // user authentication
  app
    .route('/users/login')
    .post(controller.auth.login);

  app
    .route('/users/logout')
    .post(controller.auth.logout);
};

export default Routes;




