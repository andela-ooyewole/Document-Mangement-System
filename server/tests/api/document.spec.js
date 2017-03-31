// import { agent } from 'supertest';
// import expect from 'expect';

// import app from '../../../bin/www';
// import newData from '../helper/test-helper';

// process.env.NODE_ENV = 'test';

// // This agent refers to PORT where program is runninng.
// const server = agent(app);
// const newDoc = newData.publicDoc;
// const regUser = newData.docUser;

// describe('Document API', () => {
//   let docData;
//   let regUserData;
//   let updatedDoc;
//   let adminUser;
//   let anotherUser;

//   before((done) => {
//     server
//       .post('/users')
//       .send(regUser)
//       .end((err, res) => {
//         regUserData = res.body;
//         newDoc.userId = regUserData.newUser.id;
//         newDoc.role = String(regUserData.newUser.roleId);
//         server
//           .post('/users/login')
//           .send({ email: 'oyendah@gmail.com', password: 'password' })
//           .end((err, res) => {
//             adminUser = res.body;
//             server
//                 .post('/users/login')
//                 .send({ email: 'modupe@gmail.com', password: 'password' })
//                 .end((err, res) => {
//                   anotherUser = res.body;
//                 });
//           });

//         done();
//       });
//   });

//   describe('Create Document', () => {
//     it('should create new document', (done) => {
//       server
//         .post('/documents')
//         .set('x-access-token', regUserData.token)
//         .send(newDoc)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           docData = res.body;
//           expect(res.status).toEqual(201);
//           expect(res.body.message).toEqual(
//             'Document created successfully.');
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should 400 for invalid document data', (done) => {
//       server
//         .post('/documents')
//         .set('x-access-token', regUserData.token)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(400);
//           expect(res.body.message).toEqual(
//             'An error occured while creating document');
//           if (err) return done(err);
//           done();
//         });
//     });
//   });

//   describe('/GET Documents', () => {
//     it('should 401 for unauthorized user without token', (done) => {
//       server
//         .get('/documents/?limit=10&offset=1')
//         .end((err, res) => {
//           expect(res.status).toEqual(401);
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should 200 for authorized user with token', (done) => {
//       server
//         .get('/documents/?limit=10&offset=1')
//         .set('x-access-token', adminUser.token)
//         .end((err, res) => {
//           expect(res.status).toEqual(200);
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should 200 without limit and offset', (done) => {
//       server
//         .get('/documents/')
//         .set('x-access-token', adminUser.token)
//         .end((err, res) => {
//           expect(res.status).toEqual(200);
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should 403 for Unauthorized user', (done) => {
//       server
//         .get('/documents/?limit=10&offset=1')
//         .set('x-access-token', regUserData.token)
//         .end((err, res) => {
//           expect(res.status).toEqual(403);
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should return document with specified id', (done) => {
//       server
//         .get(`/documents/${docData.document.id}`)
//         .set('x-access-token', regUserData.token)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(200);
//           expect(res.body.title).toEqual(docData.document.title);
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should return Document Not Found for invalid document Id', (done) => {
//       server
//         .get('/documents/99910')
//         .set('x-access-token', regUserData.token)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(404);
//           expect(res.body.message).toEqual('Document Not Found');
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should return documents the specified user', (done) => {
//       server
//         .get(`/users/${regUserData.newUser.id}/documents`)
//         .set('x-access-token', regUserData.token)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(200);
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should return users documents with public and same role ', (done) => {
//       server
//         .get(`/users/${regUserData.newUser.id}/alldocuments`)
//         .set('x-access-token', regUserData.token)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(200);
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should return user not found', (done) => {
//       server
//         .get('/users/100/documents')
//         .set('x-access-token', regUserData.token)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(404);
//           expect(res.body.message).toEqual('User Not Found');
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should return Error occurred while retrieving user document',
//     (done) => {
//       server
//         .get('/users/oyendah/documents')
//         .set('x-access-token', regUserData.token)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(400);
//           expect(res.body.message).toEqual(
//             'Error occurred while retrieving user document');
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should return 400 code status for invalid document Id', (done) => {
//       server
//         .get('/documents/oyendah')
//         .set('x-access-token', regUserData.token)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(400);
//           expect(res.body.message).toEqual(
//             'Error occurred while retrieving documents');
//           if (err) return done(err);
//           done();
//         });
//     });
//   });

//   describe('/PUT update document', () => {
//     const fieldsToUpdate = {
//       title: 'Newly Updated Document',
//     };

//     it('should update document data ', (done) => {
//       server
//         .put(`/documents/${docData.document.id}`)
//         .set('x-access-token', regUserData.token)
//         .send(fieldsToUpdate)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           updatedDoc = res.body;
//           expect(res.status).toEqual(200);
//           expect(res.body.message).toEqual('Document updated successfully');
//           if (err) {
//             done(err);
//           }
//           done();
//         });
//     });

//     it('should return Document Not Found for invalid Id', (done) => {
//       server
//         .put('/documents/100')
//         .set('x-access-token', adminUser.token)
//         .send(fieldsToUpdate)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(404);
//           expect(res.body.message).toEqual('Document Not Found');
//           if (err) {
//             done(err);
//           }
//           done();
//         });
//     });

//     it('should return Document Not Found for invalid Id', (done) => {
//       server
//         .put('/documents/oyendah')
//         .set('x-access-token', adminUser.token)
//         .send(fieldsToUpdate)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(400);
//           expect(res.body.message).toEqual('Error updating document');
//           if (err) {
//             done(err);
//           }
//           done();
//         });
//     });

//     it('should return Error updating document ', (done) => {
//       server
//         .put(`/documents/${docData.document.id}`)
//         .set('x-access-token', regUserData.token)
//         .send({ userId: 10 })
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(400);
//           if (err) {
//             done(err);
//           }
//           done();
//         });
//     });

//     it('should return Error updating document ', (done) => {
//       server
//         .put(`/documents/${docData.document.id}`)
//         .set('x-access-token', anotherUser.token)
//         .send(fieldsToUpdate)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(403);
//           expect(res.body.message).toEqual('Unauthorized Access');
//           if (err) {
//             done(err);
//           }
//           done();
//         });
//     });
//   });

//   describe('/DELETE document data', () => {
//     it('should delete document data ', (done) => {
//       server
//         .delete(`/documents/${docData.document.id}`)
//         .set('x-access-token', regUserData.token)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(200);
//           expect(res.body.message).toEqual(
//             `${updatedDoc.updatedDoc.title}, was successfully deleted`);
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should return document not found ', (done) => {
//       server
//         .delete('/documents/100')
//         .set('x-access-token', regUserData.token)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(404);
//           expect(res.body.message).toEqual('Document Not Found');
//           if (err) return done(err);
//           done();
//         });
//     });

//     it('should return document not found ', (done) => {
//       server
//         .delete('/documents/oyendah')
//         .set('x-access-token', regUserData.token)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           expect(res.status).toEqual(400);
//           expect(res.body.message).toEqual('Error deleting document');
//           if (err) return done(err);
//           done();
//         });
//     });
//   });
// });
