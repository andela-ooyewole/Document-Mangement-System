/* eslint-disable */
import faker from 'faker';
/* eslint-enable */

export default {
  adminRole: {
    id: 1,
    title: 'Administrator'
  },
  exampleRole: {
    id: 2,
    title: faker.random.word(),
  },
  exampleRole1: {
    title: faker.random.word(),
  },
  adminUser: {
    id: 1,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    password: 'password',
    roleId: 1
  },
  exampleUser1: {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    password: faker.internet.password(),
    roleId: 2
  },
  exampleUser2: {
    id: 2,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    password: faker.internet.password(),
    roleId: 2
  },
  exampleUser3: {
    id: 3,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    password: faker.internet.password(),
    roleId: 2
  },
  publicDoc: {
    title: faker.random.word(),
    content: faker.lorem.paragraph(),
    access: 'public'
  },
  exampleDocument: {
    title: faker.company.catchPhrase(),
    content: faker.lorem.paragraph(),
    access: 'public',
    userId: 1
  },
  exampleAccess: {
    email: faker.internet.email(),
    canEdit: true
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
