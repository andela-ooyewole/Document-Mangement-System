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
const Access = model.access;
const access = data.exampleAccess;
const Document = model.document;
const document = data.exampleDocument;

describe('Access Model', () => {
  let newAccess;
  let newDocument;

  before((done) => {
    Role.create(role);
    User.create(user).then(() => {
      Document.create(document)
      .then((createdDocument) => {
        newDocument = createdDocument;
        access.documentId = newDocument.id;
        done();
      });
    });
  });

  after((done) => {
    Document.destroy({ where: { userId: user.id } });
    User.destroy({ where: { email: user.email } });
    Role.destroy({ where: { id: role.id } });
    done();
  });

  describe('Create shared access for a document', () => {
    it('should create a document access', (done) => {
      Access.create(access)
        .then((createdAccess) => {
          newAccess = createdAccess;
          done();
        });
    });

    it('document access data should exist', () => {
      expect(newAccess).toExist();
      expect(typeof newAccess).toEqual('object');
      expect(newAccess).toExist('email');
    });

    it('created access should have name, email', () => {
      expect(newAccess.email).toEqual(access.email);
      expect(newAccess.documentId).toEqual(access.documentId);
    });

    it('should its canEdit option activated', () => {
      expect(newAccess.canEdit).toExist();
    });
  });

  describe('Shared Model Validation', () => {
    it('requires email field to share a document with', (done) => {
      Access.create(data.invalid.nullEmail)
        .catch((error) => {
          expect(/notNull Violation: email cannot be null/
            .test(error.message)).toBeTruthy;
          done();
        });
    });

    it('mail can not be empty', () => {
      Access.create(data.invalid.emptyEmail)
        .catch((error) => {
          expect(/Validation error: Validation notEmpty failed/
            .test(error.message)).toBeTruthy;
          expect(/SequelizeValidationError/.test(error.name)).toBeTruthy;
        });
    });
  });
});
