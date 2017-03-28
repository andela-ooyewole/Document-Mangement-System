/* eslint-disable */
/* eslint-enable */
import supertest from 'supertest';
import expect from 'expect';
import app from '../../app';
import data from '../helper/helper';

// This agent refers to PORT where program is runninng.
const server = supertest.agent(app);

describe('User API', () => {
  describe('Create User', () => {
    it('should create new user', (done) => {
      server
        .post('/users')
        .send(data.user)
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
