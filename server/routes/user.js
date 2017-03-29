/* eslint-disable */
import controller from '../controllers';
/* eslint-enable */

const Routes = (app) => {
  /**
   * CRUD api for user model
   */
  app
    .route('/users')
    .post(controller.user.create);

  /**
   * DEFAULT route
   */
  app
    .route('/')
    .get((req, res) => {
      res.send('Document Management System');
    });
};

export default Routes;
