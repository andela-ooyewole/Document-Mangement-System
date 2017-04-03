/* eslint-disable */
import controller from '../controllers';
import middleware from '../middlewares';
/* eslint-enable */

const verify = middleware.authentication.verifyToken;
const adminAccess = middleware.authentication.adminAccess;

const Routes = (app) => {
  // CRUD api for user model
  app
    .route('/users')
    .post(controller.user.create)
    .get(verify, adminAccess, controller.user.list);

  app
    .route('/users/:id')
    .get(verify, controller.user.retrieve)
    .put(verify, controller.user.update)
    .delete(verify, controller.user.destroy);

  app
    .route('/api/users/:identifier')
    .get(controller.user.getExistingUser);

  app
    .route('/users/:id/documents')
    .get(verify, controller.user.findUserDocuments);
};

export default Routes;
