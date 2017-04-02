/* eslint-disable */
import supertest from 'supertest';
import expect from 'expect';
import app from '../../app';
import model from '../../models/';
import data from '../helper/helper';
/* eslint-enable */

process.env.NODE_ENV = 'test';

// This agent refers to PORT where program is runninng.
const server = supertest.agent(app);
const Document = model.document;
const User = model.user;
const adminUser = data.adminUser;
const user2 = data.exampleUser2;
const user3 = data.exampleUser3;
const Role = model.role;
const role1 = data.adminRole;
const role2 = data.exampleRole;
const exampleDocumentUserId = data.exampleDocument.userId;
const document = data.exampleDocument;

describe('Document API', () => {
  let newDocumentRes;
  let documentOwnerUser2;
  let adminToken;
  let user3Token;
  let updatedDocument;

  before((done) => {
    Role.create(role1);
    Role.create(role2);
    server
      .post('/users')
      .send(adminUser)
      .end((err, res) => {
        adminToken = res.body;
        server
          .post('/users')
          .send(user2)
          .end((err, res) => {
            documentOwnerUser2 = res.body;
            document.userId = documentOwnerUser2.newUser.id;
            server
              .post('/users')
              .send(user3)
              .end((err, res) => {
                user3Token = res.body;
                done();
              });
          });
      });
  });

  after((done) => {
    adminUser.id = 1;
    document.userId = exampleDocumentUserId;
    Document.destroy({ where: { id: newDocumentRes.newDocument.id } }).then(() => {
      User.destroy({ where: { email: user3.email } }).then(() => {
        User.destroy({ where: { email: user2.email } }).then(() => {
          User.destroy({ where: { email: adminUser.email } }).then(() => {
            Role.destroy({ where: { id: role2.id } }).then(() => {
              Role.destroy({ where: { id: role1.id } }).then(() => done());
            });
          });
        });
      });
    });
  });

  describe('Create Document', () => {
    it('should create new document', (done) => {
      server
        .post('/documents')
        .set('x-access-token', documentOwnerUser2.token)
        .send(document)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          newDocumentRes = res.body;
          expect(res.status).toEqual(201);
          expect(res.body.message).toEqual(
            'Document created successfully.');
          if (err) return done(err);
          done();
        });
    });

    it('should 400 for invalid document data', (done) => {
      server
        .post('/documents')
        .set('x-access-token', documentOwnerUser2.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual(
            'An error occured while creating document');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/GET Documents', () => {
    it('should 401 for unauthorized user without token', (done) => {
      server
        .get('/documents/?limit=10&offset=1')
        .end((err, res) => {
          expect(res.status).toEqual(401);
          if (err) return done(err);
          done();
        });
    });

    it('should return document with specified id', (done) => {
      server
        .get(`/documents/${newDocumentRes.newDocument.id}`)
        .set('x-access-token', documentOwnerUser2.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.title).toEqual(newDocumentRes.newDocument.title);
          if (err) return done(err);
          done();
        });
    });

    it('should return Document Not Found for invalid document Id', (done) => {
      server
        .get('/documents/99910')
        .set('x-access-token', documentOwnerUser2.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Document Not Found');
          if (err) return done(err);
          done();
        });
    });

    it('should return documents the specified user', (done) => {
      server
        .get(`/users/${documentOwnerUser2.newUser.id}/documents`)
        .set('x-access-token', documentOwnerUser2.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          if (err) return done(err);
          done();
        });
    });

    it('should return users documents with public and same role ', (done) => {
      server
        .get(`/users/${documentOwnerUser2.newUser.id}/alldocuments`)
        .set('x-access-token', documentOwnerUser2.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          if (err) return done(err);
          done();
        });
    });

    it('should return user not found', (done) => {
      server
        .get('/users/100/documents')
        .set('x-access-token', documentOwnerUser2.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('User Not Found');
          if (err) return done(err);
          done();
        });
    });

    it('should return Error occurred while retrieving user document',
      (done) => {
        server
          .get(`/users/${adminUser.username}/documents`)
          .set('x-access-token', documentOwnerUser2.token)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            expect(res.status).toEqual(400);
            expect(res.body.message).toEqual(
              'Error occurred while retrieving user document');
            if (err) return done(err);
            done();
          });
      });

    it('should return 400 code status for invalid document Id', (done) => {
      server
        .get(`/documents/${adminUser.username}`)
        .set('x-access-token', documentOwnerUser2.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual(
            'Error occurred while retrieving documents');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/PUT update document', () => {
    const fieldsToUpdate = {
      title: 'Newly Updated Document',
    };

    it('should update document data ', (done) => {
      server
        .put(`/documents/${newDocumentRes.newDocument.id}`)
        .set('x-access-token', documentOwnerUser2.token)
        .send(fieldsToUpdate)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          updatedDocument = res.body;
          expect(res.status).toEqual(200);
          expect(res.body.message).toEqual('Document updated successfully');
          if (err) {
            done(err);
          }
          done();
        });
    });

    it('should return Document Not Found for invalid Id', (done) => {
      server
        .put('/documents/100')
        .set('x-access-token', adminToken.token)
        .send(fieldsToUpdate)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Document Not Found');
          if (err) {
            done(err);
          }
          done();
        });
    });

    it('should return Document Not Found for invalid Id', (done) => {
      server
        .put(`/documents/${adminUser.username}`)
        .set('x-access-token', adminToken.token)
        .send(fieldsToUpdate)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual('Error updating document');
          if (err) {
            done(err);
          }
          done();
        });
    });

    it('should return Error updating document ', (done) => {
      server
        .put(`/documents/${newDocumentRes.newDocument.id}`)
        .set('x-access-token', documentOwnerUser2.token)
        .send({ userId: 10 })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          if (err) {
            done(err);
          }
          done();
        });
    });

    it('should return Error updating document ', (done) => {
      server
        .put(`/documents/${newDocumentRes.newDocument.id}`)
        .set('x-access-token', user3Token.token)
        .send(fieldsToUpdate)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(403);
          expect(res.body.message).toEqual('Unauthorized Access');
          if (err) {
            done(err);
          }
          done();
        });
    });
  });

  describe('/DELETE document data', () => {
    it('should delete document data ', (done) => {
      server
        .delete(`/documents/${newDocumentRes.newDocument.id}`)
        .set('x-access-token', documentOwnerUser2.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.message).toEqual(
            `${updatedDocument.updatedDoc.title}, was successfully deleted`);
          if (err) return done(err);
          done();
        });
    });

    it('should return document not found ', (done) => {
      server
        .delete('/documents/100')
        .set('x-access-token', documentOwnerUser2.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Document Not Found');
          if (err) return done(err);
          done();
        });
    });

    it('should return document not found ', (done) => {
      server
        .delete(`/documents/${adminUser.username}`)
        .set('x-access-token', documentOwnerUser2.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual('Error deleting document');
          if (err) return done(err);
          done();
        });
    });
  });
});
