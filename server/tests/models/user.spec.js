/* eslint-disable */
import expect from 'expect';
import model from '../../models/';
import data from '../helper/helper';
/* eslint-enable */

/* eslint no-unused-expressions: "off"*/

const User = model.user;
const newUser = data.adminUser;

describe('User Model', () => {
  let user;

  describe('Create User', () => {
    it('should be able to create a user', () => {
      expect(User).toExist();
      expect(typeof User).toEqual('object');
    });

    it('should create new user', (done) => {
      User.create(newUser)
        .then((createdUser) => {
          user = createdUser;
          done();
          expect(user).toExist();
        });
    });

    it('created user should have firstname,lastname and email', () => {
      expect(user.firstname).toEqual(newUser.firstname);
      expect(user.lastname).toEqual(newUser.lastname);
      expect(user.username).toEqual(newUser.username);
      expect(user.email).toEqual(newUser.email);
    });

    it('should create a user with hashed password', () => {
      expect(user.password).toNotEqual(newUser.password);
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
      User.create(newUser)
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
      User.findById(user.id)
        .then((foundUser) => {
          expect(foundUser.verifyPassword(newUser.password)).toBeTruthy;
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
