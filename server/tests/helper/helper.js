/* eslint-disable */
import faker from 'faker';
/* eslint-enable */

export default {
  adminUser: {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    password: 'dairy',
    roleId: 1
  },
  user: {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    password: faker.internet.password(),
    roleId: 2
  },
  invalid: {
    emailEmpty: {
      firstname: 'Franklin',
      lastname: 'Oyewole',
      username: 'frank',
      email: '',
      password: '1234'
    },
    passwordEmpty: {
      firstname: 'Franklin',
      lastname: 'Oyewole',
      username: 'frank',
      email: 'frank@yahoo.com',
      password: ''
    },
    emptyTitle: {
      docContent: faker.lorem.paragraph(),
      viewAcces: 'role',
      userId: 2
    },
    emptyEmail: {
      email: '',
      canEdit: true,
      documentId: 1
    },
    noName: {
      email: 'femioyewole@gmail.com',
      password: '1234',
    },
    noEmail: {
      firstname: 'femi',
      lastname: 'Oyewole',
      password: '1234',
    },
    noUsername: {
      firstname: 'femi',
      lastname: 'Oyewole',
      email: 'femioyewole@hotmail.com',
      password: '1234',
    },
    invalidEmail: {
      firstname: 'Franklin',
      lastname: 'Oyewole',
      username: 'frank',
      email: 'frank',
      password: '1234'
    },
    nullEmail: {
      canEdit: true,
      documentId: 1
    },
  }
};
