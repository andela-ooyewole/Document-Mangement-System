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
const role = data.adminRole;
const User = model.user;
const user = data.adminUser;

describe('Authentication', () => {
  let response;

  before((done) => {
    Role.create(role);
    User.create(user);
    done();
  });

  after((done) => {
    User.destroy({ where: { email: user.email } });
    Role.destroy({ where: { id: role.id } });
    done();
  });

  describe('GET/ Home page', () => {
    it('should show the home page', (done) => {
      server
        .get('/')
        .end((err, res) => {
          expect(res.status).toEqual(200);
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Login API', () => {
    it('should login user', (done) => {
      server
        .post('/users/login')
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          response = res.body;
          expect(res.status).toEqual(200);
          expect(res.body.message).toEqual('Authentication successfull.');
          done();
        });
    });

    it('logged in user should have a token', (done) => {
      expect(response.token).toExist();
      done();
    });

    it('should return Wrong Password login user', (done) => {
      server
        .post('/users/login')
        .send({ email: user.email, password: 'notPassword' })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.message).toEqual(
            'Authentication failed. Wrong password.');
          done();
        });
    });
  });

  describe('Invalid Login', () => {
    it('should not login user with invalid email', (done) => {
      server
        .post('/users/login')
        .send({ email: 'nonuser@gmail.com', password: '12345' })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual(
            'Authentication Failed. User not found.');
          done();
        });
    });

    it('should not authenticate undefined user', (done) => {
      server
        .post('/users/login')
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual(
            'No email entered');
          done();
        });
    });

    it('should not authenticate user without password', (done) => {
      server
        .post('/users/login')
        .send({ email: user.email })
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual(
            'Error authenticating user.');
          done();
        });
    });
  });

  describe('Logout API', () => {
    it('Should return a message on logout', (done) => {
      server
        .post('/users/logout')
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.message).toEqual('Loggout successfull.');
          done();
        });
    });
  });
});
