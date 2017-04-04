/* eslint-disable */
import expect from 'expect';
import model from '../../models/';
import data from '../helper/helper';
/* eslint-enable */

/* eslint no-unused-expressions: "off"*/

const Role = model.role;
const role = data.exampleRole;

describe('Roles Model', () => {
  let newRole;


  before((done) => {
    Role.create(role).then((createdRole) => {
      newRole = createdRole;
      done();
    });
  });

  after((done) => {
    Role.destroy({ where: { id: newRole.id } })
      .then(() => done());
  });

  describe('Create Role', () => {
    it('should be able to create a role', () => {
      expect(Role).toExist();
      expect(typeof Role).toEqual('object');
    });

    it('should create new role', () => {
      Role.findOne({
        where: {
          title: role.title
        }
      })
        .then((foundUser) => {
          expect(foundUser).toExist();
        });
    });
  });

  describe('Role Validation', () => {
    it('requires title field to create a role', (done) => {
      Role.create()
        .catch((error) => {
          expect(/notNull Violation/.test(error.message)).toBeTruthy;
          done();
        });
    });
    it('ensures a role can only be created once', (done) => {
      Role.create(role)
        .catch((error) => {
          expect(/SequelizeUniqueConstraintError/.test(error.name)).toBeTruthy;
          done();
        });
    });
  });
});
