/* eslint-disable */
import expect from 'expect';
import model from '../../models/';
import data from '../helper/helper';
/* eslint-enable */

/* eslint no-unused-expressions: "off"*/
const Role = model.role;
const role = data.exampleRole;
const User = model.user;
const user = data.exampleUser1;
const Document = model.document;
const publicDocument = data.publicDoc;

describe('Document Model', () => {
  let newDocument;
  let newUser;

  before((done) => {
    Role.create(role);
    User.create(user)
      .then((createdUser) => {
        newUser = createdUser;
        publicDocument.userId = newUser.id;
        done();
      });
  });

  after((done) => {
    Document.destroy({ where: { id: newDocument.id } });
    User.destroy({ where: { id: newUser.id } });
    Role.destroy({ where: { id: role.id } });
    done();
  });

  describe('Create Document', () => {
    it('should create new document', (done) => {
      Document.create(publicDocument)
        .then((createdDocument) => {
          newDocument = createdDocument;
          done();
        });
    });

    it('created new document should exist', () => {
      expect(newDocument).toExist();
      expect(typeof newDocument).toEqual('object');
      expect(newDocument).toExist('title');
      expect(newDocument).toExist('content');
    });

    it('created new document should have name, email', () => {
      expect(newDocument.title).toEqual(publicDocument.title);
      expect(newDocument.content).toEqual(publicDocument.content);
      expect(newDocument.access).toEqual(publicDocument.access);
    });

    it('should create a document with correct userId', () => {
      expect(newDocument.userId).toEqual(newUser.id);
    });

    it('should create a document with published date', () => {
      expect(newDocument.createdAt).toExist();
    });

    it('should create a document with access set to public', () => {
      expect(newDocument.access).toEqual('public');
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
