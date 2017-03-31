/* eslint-disable */
import controller from '../controllers';
/* eslint-enable */

const Routes = (app) => {
  // CRUD api for user model
  app
    .route('/users')
    .post(controller.user.create);
};

export default Routes;
