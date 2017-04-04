/* eslint-disable */
import supertest from 'supertest';
import expect from 'expect';
import app from '../../app';
import model from '../../models/';
import data from '../helper/helper';
/* eslint-enable */

// This agent refers to PORT where program is runninng.
const server = supertest.agent(app);
const Role = model.role;
const role1 = data.adminRole;
const role2 = data.exampleRole;
const User = model.user;
const adminUser = data.adminUser;
const user2 = data.exampleUser2;


describe('Search API', () => {
  let adminUserRes;
  let user2Res;

  before((done) => {
    Role.create(role1).then(() => {
      Role.create(role2);
    });
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

  describe('User Search', () => {
    it('Should return a list of users based on search criteria', (done) => {
      server
        .get('/search/users/?q=r')
        .set({
          'x-access-token': adminUserRes.token
        })
        .end((err, res) => {
          expect(res.body).toExist();
          done();
        });
    });

    it('Should return users not found', (done) => {
      server
        .get('/search/users/?q=zu')
        .set({
          'x-access-token': adminUserRes.token
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Users Not Found');
          done();
        });
    });

    it('Should return error for non-admin search', (done) => {
      server
        .get('/search/users/?q=r')
        .set({ 'x-access-token': user2Res.token })
        .end((err, res) => {
          expect(res.body.message)
          .toEqual('User is unauthorized for this request.');
          done();
        });
    });
  });

  describe('Document Search', () => {
    it('Should return error for non-admin search', (done) => {
      server
        .get('/search/documents/?q=in')
        .set({ 'x-access-token': user2Res.token })
        .end((err, res) => {
          expect(res.body.message)
          .toEqual('User is unauthorized for this request.');
          done();
        });
    });
  });
});
