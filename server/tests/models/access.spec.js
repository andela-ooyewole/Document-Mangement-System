/* eslint-disable */
import expect from 'expect';
import model from '../../models/';
import data from '../helper/helper';
/* eslint-enable */

/* eslint no-unused-expressions: "off"*/
const User = model.user;
const Access = model.access;
const Document = model.document;
const sharedDocument = data.sharedDocument;
const access1 = data.access1;
const user = data.user3;

describe('Access Model', () => {
  let documentAccess;
  let document;

  User.create(user);

  Document.create(sharedDocument)
    .then((newDoc) => {
      document = newDoc;
      access1.userId = document.id;
    });

  describe('Create shared access for a document', () => {
    it('should create a document access', (done) => {
      Access.create(access1)
        .then((access) => {
          documentAccess = access;
          done();
        });
    });

    it('document access data should exist', () => {
      expect(documentAccess).toExist();
      expect(typeof documentAccess).toEqual('object');
      expect(documentAccess).toExist('email');
    });

    it('created access should have name, email', () => {
      expect(documentAccess.email).toEqual(access1.email);
      expect(documentAccess.documentId).toEqual(access1.documentId);
    });

    it('should its canEdit option activated', () => {
      expect(documentAccess.canEdit).toExist();
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
