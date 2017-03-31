/* eslint-disable */
import supertest from 'supertest';
import expect from 'expect';
import app from '../../app';
import data from '../helper/helper';
/* eslint-enable */
import model from '../../models/';

// This agent refers to PORT where program is runninng.
const server = supertest.agent(app);
const Role = model.role;
const role = data.exampleRole;
const User = model.user;
const user = data.exampleUser;

describe('User API', () => {
  before((done) => {
    Role.create(role);
    done();
  });

  after((done) => {
    User.destroy({ where: { roleId: 2 } });
    Role.destroy({ where: { id: role.id } });
    done();
  });

  describe('POST/ Create User', () => {
    it('should create new user', (done) => {
      server
        .post('/users')
        .send(user)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toEqual(201);
          expect(res.body.message).toEqual('User created successfully');
          if (err) return done(err);
          done();
        });
    });
  });
});
