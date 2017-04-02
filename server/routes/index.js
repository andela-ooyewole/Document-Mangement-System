/* eslint-disable */
import authRoute from './authentication';
import userRoute from './user';
import documentRoute from './document';
/* eslint-enable */

const Routes = (app) => {
  authRoute(app);
  userRoute(app);
  documentRoute(app);
};

export default Routes;
