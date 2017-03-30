/* eslint-disable */
import expect from 'expect';
import model from '../../models/';
import data from '../helper/helper';
/* eslint-enable */

/* eslint no-unused-expressions: "off"*/

const User = model.user;

describe('User Model', () => {
  let user;

  describe('Create User', () => {
    it('should create a user with an object', () => {
      expect(User).toExist;
      expect(typeof User).toEqual('object');
    });

    it('should create new user', (done) => {
      User.create(data.adminUser)
        .then((createdUser) => {
          user = createdUser;
          done();
        });
    });

    it('created new user should exist', () => {
      expect(user).toExist();
      expect(user).toExist('email');
    });

    it('created user should have firstname,lastname and email', () => {
      expect(user.firstname).toEqual(data.adminUser.firstname);
      expect(user.lastname).toEqual(data.adminUser.lastname);
      expect(user.username).toEqual(data.adminUser.username);
      expect(user.email).toEqual(data.adminUser.email);
    });

    it('should create a user with hashed password', () => {
      expect(user.password).toNotEqual(data.adminUser.password);
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
      User.create(data.adminUser)
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
          expect(foundUser.verifyPassword(data.adminUser.password)).toBeTruthy;
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
