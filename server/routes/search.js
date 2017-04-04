
/* eslint-disable */
import controller from '../controllers';
import middleware from '../middlewares';
/* eslint-enable */

const verify = middleware.authentication.verifyToken;
const adminAccess = middleware.authentication.adminAccess;

const Routes = (app) => {
  // CRUD api for search
  app
    .route('/search/users/')
    .get(verify, adminAccess, controller.search.userSearch);

  app
    .route('/search/documents/')
    .get(verify, adminAccess, controller.search.documentSearch);
};

export default Routes;
