/* eslint-disable */
import controller from '../controllers';
/* eslint-enable */

const Routes = (app) => {
  // user authentication
  app
    .route('/users/login')
    .post(controller.auth.login);

  app
    .route('/users/logout')
    .post(controller.auth.logout);
};

export default Routes;
