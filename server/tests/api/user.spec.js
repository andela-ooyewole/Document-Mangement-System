/* eslint-disable */
import supertest from 'supertest';
import expect from 'expect';
import app from '../../app';
import data from '../helper/helper';
import model from '../../models/';
/* eslint-enable */

// This agent refers to PORT where program is runninng.
const server = supertest.agent(app);
const Role = model.role;
const role1 = data.adminRole;
const role2 = data.exampleRole;
const User = model.user;
const user = data.adminUser;
const user2 = data.exampleUser2;

describe('User API', () => {
  let adminUserRes;
  let user2Res;

  before((done) => {
    Role.create(role1).then(() => {
      Role.create(role2).then(() => {
        server
          .post('/users')
          .send(user2)
          .end((err, res) => {
            user2Res = res.body;
            done();
          });
      });
    });
  });

  after((done) => {
    User.destroy({ where: { roleId: 2 } }).then(() => {
      Role.destroy({ where: { id: role2.id } }).then(() => {
        Role.destroy({ where: { id: role1.id } }).then(() => done());
      });
    });
  });

  describe('POST/ Create User', () => {
    it('should create new user', (done) => {
      server
        .post('/users')
        .send(user)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          adminUserRes = res.body;
          expect(res.status).toEqual(201);
          expect(res.body.message).toEqual('User created successfully');
          if (err) return done(err);
          done();
        });
    });

    it('should not create user with the same email', (done) => {
      server
        .post('/users')
        .send(user)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(409);
          expect(res.body.message).toEqual('User Already Exists');
          if (err) return done(err);
          done();
        });
    });

    it('should not create new user with empty params', (done) => {
      server
        .post('/users')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual('Error creating undefined');
          if (err) return done(err);
          done();
        });
    });

    it('should not create new user with empty email', (done) => {
      server
        .post('/users')
        .send({ name: 'Charles', password: '1234' })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual('Error creating Charles');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/GET User', () => {
    it('should 401 for unautorized user without token', (done) => {
      server
        .get('/users')
        .end((err, res) => {
          expect(res.status).toEqual(401);
          if (err) return done(err);
          done();
        });
    });

    it('should return user when limit and offset are set', (done) => {
      server
        .get('/users/?limit=10&offset=1')
        .set('x-access-token', adminUserRes.token)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          if (err) return done(err);
          done();
        });
    });

    it('should return user when limit and offset are not set', (done) => {
      server
        .get('/users/')
        .set('x-access-token', adminUserRes.token)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          if (err) return done(err);
          done();
        });
    });

    it('should return user with specified id', (done) => {
      server
        .get(`/users/${adminUserRes.newUser.id}`)
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.foundUser.email).toEqual(adminUserRes.newUser.email);
          if (err) return done(err);
          done();
        });
    });

    it('should not return user with invalid id', (done) => {
      server
        .get('/users/oyendah')
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          if (err) return done(err);
          done();
        });
    });

    it('should return user with specified username or email', (done) => {
      server
        .get(`/api/users/${adminUserRes.newUser.username}`)
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.foundUser.email).toEqual(adminUserRes.newUser.email);
          if (err) return done(err);
          done();
        });
    });

    it('should return 404 with specified username or email', (done) => {
      server
        .get('/api/users/Casandra')
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('User Not Found');
          if (err) return done(err);
          done();
        });
    });

    it('should return User Not Found for invalid user Id', (done) => {
      server
        .get('/users/99910')
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('User Not Found');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/PUT update user', () => {
    const fieldsToUpdate = {
      name: 'Subair Oyin',
    };
    it('should update user data ', (done) => {
      server
        .put(`/users/${adminUserRes.newUser.id}`)
        .set('x-access-token', adminUserRes.token)
        .send(fieldsToUpdate)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.message).toEqual('User updated successfully');
          if (err) return done(err);
          done();
        });
    });

    it('should not update user data with invalid user id ', (done) => {
      server
        .put('/users/oyendah')
        .set('x-access-token', adminUserRes.token)
        .send({ roleId: 100 })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual('Error updating user');
          if (err) return done(err);
          done();
        });
    });

    it('should not update user data with invalid id', (done) => {
      server
        .put('/users/100')
        .set('x-access-token', adminUserRes.token)
        .send(fieldsToUpdate)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('User Not Found');
          if (err) return done(err);
          done();
        });
    });

    it('should not update user data with invalid data', (done) => {
      server
        .put(`/users/${adminUserRes.newUser.id}`)
        .set('x-access-token', adminUserRes.token)
        .send({ roleId: 10 })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual('Error updating user');
          if (err) return done(err);
          done();
        });
    });

    it('should return 403 updating another user without admin right ',
      (done) => {
        server
          .put(`/users/${adminUserRes.newUser.id}`)
          .set('x-access-token', user2Res.token)
          .send(fieldsToUpdate)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            expect(res.status).toEqual(403);
            expect(res.body.message).toEqual('Unauthorized Access');
            if (err) return done(err);
            done();
          });
      });
  });

  describe('/DELETE user data', () => {
    it('should delete user data ', (done) => {
      server
        .delete(`/users/${adminUserRes.newUser.id}`)
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          if (err) return done(err);
          done();
        });
    });

    it('should return user not found with invalid id', (done) => {
      server
        .delete('/users/100')
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('User Not Found');
          if (err) return done(err);
          done();
        });
    });

    it('should return 403 deleting another user without admin right',
      (done) => {
        server
          .delete('/users/1')
          .set('x-access-token', user2Res.token)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            expect(res.status).toEqual(403);
            expect(res.body.message).toEqual('Unauthorized Access');
            if (err) return done(err);
            done();
          });
      });

    it('should not delete user data with invalid user id ', (done) => {
      server
        .delete('/users/oyendah')
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual('Error deleting user');
          if (err) return done(err);
          done();
        });
    });
  });
});
