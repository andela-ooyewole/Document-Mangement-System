/* eslint-disable */
import controller from '../controllers';
import middleware from '../middlewares';
/* eslint-enable */

const verify = middleware.authentication.verifyToken;
const adminAccess = middleware.authentication.adminAccess;

const Routes = (app) => {
  // CRUD api for role model
  app
    .route('/roles')
    .post(verify, adminAccess, controller.role.create)
    .get(verify, adminAccess, controller.role.list);
  app
    .route('/roles/:id')
    .get(verify, adminAccess, controller.role.retrieve)
    .put(verify, adminAccess, controller.role.update)
    .delete(verify, adminAccess, controller.role.destroy);
};

export default Routes;
