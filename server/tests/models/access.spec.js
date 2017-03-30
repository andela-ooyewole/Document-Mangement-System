/* eslint-disable */
import expect from 'expect';
import model from '../../models/';
import data from '../helper/helper';
/* eslint-enable */

/* eslint no-unused-expressions: "off"*/

const Access = model.access;
const Document = model.document;
const doc = data.sharedDoc;
const sharedDoc = data.shared;

describe('Document Model', () => {
  let docData;
  let sharedData;

  Document.create(doc)
    .then((newDoc) => {
      docData = newDoc;
      sharedDoc.userId = docData.id;
    });

  describe('Create Document', () => {
    it('should share document', (done) => {
      Access.create(sharedDoc)
        .then((shared) => {
          sharedData = shared;
          done();
        });
    });
    it('shared document data should exist', () => {
      expect(sharedData).toExist();
      expect(typeof sharedData).toEqual('object');
      expect(sharedData).toExist('email');
    });
    it('created new document should have name, email', () => {
      expect(sharedData.email).toEqual(sharedDoc.email);
      expect(sharedData.documentId).toEqual(sharedDoc.documentId);
    });

    it('should share document with canEdit access set', () => {
      expect(sharedData.canEdit).toExist();
    });
  });

  describe('Shaed Model Validation', () => {
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
