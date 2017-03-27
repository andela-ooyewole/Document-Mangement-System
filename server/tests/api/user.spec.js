/* eslint-disable */
import supertest from 'supertest';
import expect from 'expect';
import app from '../../app';
/* eslint-enable */

// This agent refers to PORT where program is runninng.
const server = supertest.agent(app);

describe('User API', () => {
  describe('Create User', () => {
    it('should create new user', (done) => {
      server
        .get('/')
        .end((err, res) => {
          expect(res.status).toEqual(200);
          if (err) return done(err);
          done();
        });
    });
  });
});