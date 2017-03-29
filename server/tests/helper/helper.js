/* eslint-disable */
import faker from 'faker';
/* eslint-enable */

export default {
  user: {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    password: faker.internet.password(),
    roleId: 2
  }
};
