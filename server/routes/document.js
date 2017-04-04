/* eslint-disable */
import controller from '../controllers';
import middleware from '../middlewares';
/* eslint-enable */

const verify = middleware.authentication.verifyToken;
const adminAccess = middleware.authentication.adminAccess;

const Routes = (app) => {
  // CRUD api for document model
  app
    .route('/documents')
    .post(verify, controller.document.create)
    .get(verify, adminAccess, controller.document.list);

  app
    .route('/documents/:id')
    .get(verify, controller.document.retrieve)
    .put(verify, controller.document.update)
    .delete(verify, controller.document.destroy);

  app.route('/users/:id/alldocuments')
    .get(verify, controller.document.findAllUserDocument);
};

export default Routes;
