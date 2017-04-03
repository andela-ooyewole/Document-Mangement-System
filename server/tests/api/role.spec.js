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
const role = data.exampleRole1;
const User = model.user;
const adminUser = data.adminUser;
const user2 = data.exampleUser2;

describe('Roles API', () => {
  let adminUserRes;
  let user2Res;

  before((done) => {
    Role.create(role1);
    Role.create(role2);
    server
      .post('/users')
      .send(adminUser)
      .end((err, res) => {
        adminUserRes = res.body;
        server
          .post('/users')
          .send(user2)
          .end((err, res) => {
            user2Res = res.body;
            done();
          });
      });
  });

  after((done) => {
    User.destroy({ where: { email: user2.email } })
      .then(() => {
        User.destroy({ where: { email: adminUser.email } })
          .then(() => {
            Role.destroy({ where: { id: role2.id } }).then(() => {
              Role.destroy({ where: { id: role1.id } }).then(() => done());
            });
          });
      });
  });

  describe('Create Role', () => {
    it('should not create role without admin access', (done) => {
      server
        .post('/roles')
        .set('x-access-token', user2Res.token)
        .send(role)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.message).toEqual(
            'User is unauthorized for this request.');
          if (err) return done(err);
          done();
        });
    });

    it('should not create new role, should return 400', (done) => {
      server
        .post('/roles')
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body.message).toEqual('Error creating new role');
          expect(res.status).toEqual(400);
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/GET Role', () => {
    it('should return 200 for role endpoint', (done) => {
      server
        .get('/roles')
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          if (err) return done(err);
          done();
        });
    });

    it('should return Administrator for role id 1', (done) => {
      server
        .get('/roles/1')
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.foundRole.title).toEqual('Administrator');
          if (err) return done(err);
          done();
        });
    });

    it('should return Role not found', (done) => {
      server
        .get('/roles/10')
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Role Not Found');
          if (err) return done(err);
          done();
        });
    });
    it('should return Role not found', (done) => {
      server
        .get('/roles/role')
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual(
            'Error occured while retrieving role');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/PUT Role', () => {
    const fieldsToUpdate = {
      title: 'normal',
    };
    it('should update role data ', (done) => {
      server
        .put(`/roles/${role2.id}`)
        .set('x-access-token', adminUserRes.token)
        .send(fieldsToUpdate)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.message).toEqual('Role updated successfully.');
          if (err) return done(err);
          done();
        });
    });

    it(
      'should return Not authorize when user other than the admin updates role',
      (done) => {
        server
          .put(`/roles/${role2.id}`)
          .set('x-access-token', user2Res.token)
          .send(fieldsToUpdate)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(res.body.message).toEqual(
              'User is unauthorized for this request.');
            if (err) return done(err);
            done();
          });
      });

    it('should return Role Not Found when udating invalid role', (done) => {
      server
        .put('/roles/10')
        .set('x-access-token', adminUserRes.token)
        .send(fieldsToUpdate)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Role Not Found');
          if (err) return done(err);
          done();
        });
    });

    it('should return 400 updating invalid role', (done) => {
      server
        .put('/roles/role')
        .set('x-access-token', adminUserRes.token)
        .send(fieldsToUpdate)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual('Error updating role');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/DELETE Role', () => {
    it('should not delete invalid role', (done) => {
      server
        .delete('/roles/10')
        .set('x-access-token', adminUserRes.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Role Not Found');
          if (err) return done(err);
          done();
        });
    });

    it('should return 401 deleting a role without admin right', (done) => {
      server
        .delete('/roles/1')
        .set('x-access-token', user2Res.token)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.message).toEqual(
            'User is unauthorized for this request.');
          if (err) return done(err);
          done();
        });
    });

    it('should return Error deleting role when deleting invalid role',
      (done) => {
        server
          .delete('/roles/role')
          .set('x-access-token', adminUserRes.token)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            expect(res.status).toEqual(400);
            expect(res.body.message).toEqual('Error deleting Role.');
            if (err) return done(err);
            done();
          });
      });
  });
});
