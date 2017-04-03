/* eslint-disable */
/* eslint-enable */
import authRoute from './authentication';
import userRoute from './user';
import documentRoute from './document';
import roleRoute from './role';

const Routes = (app) => {
  authRoute(app);
  documentRoute(app);
  roleRoute(app);
  userRoute(app);
};

export default Routes;
