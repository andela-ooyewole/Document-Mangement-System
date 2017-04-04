/* eslint-disable */
import expect from 'expect';
import model from '../../models/';
import data from '../helper/helper';
/* eslint-enable */

/* eslint no-unused-expressions: "off"*/

const Role = model.role;
const role = data.adminRole;
const User = model.user;
const user = data.adminUser;

describe('User Model', () => {
  let newUser;

  before((done) => {
    Role.create(role).then(() => done());
  });

  after((done) => {
    User.destroy({ where: { email: user.email } }).then(() => {
      Role.destroy({ where: { id: role.id } }).then(() => done());
    });
  });

  describe('Create User', () => {
    it('should be able to create a user', () => {
      expect(User).toExist();
      expect(typeof User).toEqual('object');
    });

    it('should create new user', (done) => {
      User.create(user)
        .then((createdUser) => {
          newUser = createdUser;
          done();
          expect(newUser).toExist();
        });
    });

    it('created user should have firstname,lastname and email', () => {
      expect(newUser.firstname).toEqual(user.firstname);
      expect(newUser.lastname).toEqual(user.lastname);
      expect(newUser.username).toEqual(user.username);
      expect(newUser.email).toEqual(user.email);
    });

    it('should create a user with hashed password', () => {
      expect(newUser.password).toNotEqual(user.password);
    });
  });

  describe('User Validation', () => {
    it('requires name field to create a user', (done) => {
      User.create(data.invalid.noName)
        .catch((error) => {
          expect(/notNull Violation/.test(error.message)).toBeTruthy;
          done();
        });
    });

    it('requires email field to create a user', (done) => {
      User.create(data.invalid.noEmail)
        .catch((error) => {
          expect(/notNull Violation/.test(error.message)).toBeTruthy;
          done();
        });
    });

    it('requires username field to create a user', (done) => {
      User.create(data.invalid.noUsername)
        .catch((error) => {
          expect(/notNull Violation/.test(error.message)).toBeTruthy;
          done();
        });
    });

    it('ensures a user can only be created once', (done) => {
      User.create(user)
        .catch((error) => {
          expect(/SequelizeUniqueConstraintError/.test(error.name)).toBeTruthy;
          done();
        });
    });
  });

  describe('Email Validation', () => {
    it('requires user mail to be authentic', () => {
      User.create(data.invalid.invalidEmail)
        .catch((error) => {
          expect(/Validation error: Validation isEmail failed/
            .test(error.message)).toBeTruthy;
          expect(/SequelizeValidationError/.test(error.name)).toBeTruthy;
        });
    });

    it('email can not be empty', () => {
      User.create(data.invalid.emailEmpty)
        .catch((error) => {
          expect(/Validation error: Validation notEmpty failed/
            .test(error.message)).toBeTruthy;
          expect(/SequelizeValidationError/.test(error.name)).toBeTruthy;
        });
    });
  });

  describe('Password Validation', () => {
    it('should be equal when compared', () => {
      User.findById(newUser.id)
        .then((foundUser) => {
          expect(foundUser.verifyPassword(user.password)).toBeTruthy;
        });
    });

    it('password can not be empty', () => {
      User.create(data.invalid.passwordEmpty)
        .catch((error) => {
          expect(/Validation error: Validation notEmpty failed/
            .test(error.message)).toBeTruthy;
          expect(/SequelizeValidationError/.test(error.name)).toBeTruthy;
        });
    });
  });
});
