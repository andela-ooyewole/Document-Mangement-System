/* eslint-disable */
import expect from 'expect';
import model from '../../models/';
import data from '../helper/helper';
/* eslint-enable */

/* eslint no-unused-expressions: "off"*/

const User = model.user;
const Document = model.document;
// const adminUser = newData.adminUser;
const user = data.user;
const publicDocument = data.publicDoc;

describe('Document Model', () => {
  let docData;
  let userdata;

  User.create(user)
    .then((newUser) => {
      userdata = newUser;
      publicDocument.userId = userdata.id;
    });

  describe('Create Document', () => {
    it('should create new document', (done) => {
      Document.create(publicDocument)
        .then((newDocument) => {
          docData = newDocument;
          done();
        });
    });
    it('created new document should exist', () => {
      expect(docData).toExist();
      expect(typeof docData).toEqual('object');
      expect(docData).toExist('title');
      expect(docData).toExist('content');
    });
    it('created new document should have name, email', () => {
      expect(docData.title).toEqual(publicDocument.title);
      expect(docData.content).toEqual(publicDocument.content);
      expect(docData.access).toEqual(publicDocument.access);
    });

    it('should create a document with correct userId', () => {
      expect(docData.userId).toEqual(userdata.id);
    });

    it('should create a document with published date', () => {
      expect(docData.createdAt).toExist();
    });

    it('should create a document with access set to public', () => {
      expect(docData.access).toEqual('public');
    });
  });

  describe('Documents Validation', () => {
    it('requires title field to create a document', (done) => {
      Document.create(data.invalid.emptyTitle)
        .catch((error) => {
          expect(/notNull Violation: title cannot be null/
            .test(error.message)).toBeTruthy;
          done();
        });
    });
    it('requires unique title field to create a document', (done) => {
      Document.create(publicDocument)
        .catch((error) => {
          expect(/Validation error/.test(error.message)).toBeTruthy;
          expect(/SequelizeUniqueConstraintError/.test(error.name)).toBeTruthy;
          done();
        });
    });
  });
});
