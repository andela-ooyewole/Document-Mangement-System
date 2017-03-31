/* eslint-disable */
import authRoute from './authentication';
import userRoute from './user';
/* eslint-enable */

const routes = (router) => {
  authRoute(router);
  userRoute(router);
};

export default routes;
