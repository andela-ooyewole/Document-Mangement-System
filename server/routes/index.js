/* eslint-disable */
import authRoute from './authentication';
import userRoute from './user';
import documentRoute from './document';
import searchRoute from './search';
import roleRoute from './role';
/* eslint-enable */

const Routes = (app) => {
  authRoute(app);
  documentRoute(app);
  roleRoute(app);
  searchRoute(app);
  userRoute(app);
};

export default Routes;
