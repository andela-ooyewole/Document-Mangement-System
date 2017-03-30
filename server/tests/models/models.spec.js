/* eslint-disable */
import expect from 'expect';
import model from '../../models/';
/* eslint-enable */

describe('Models', () => {
  it('should have a Roles Model', () => {
    expect(model.role).toExist();
  });
  it('should have a Users Model', () => {
    expect(model.user).toExist();
  });
  it('should have a Documents Model', () => {
    expect(model.document).toExist();
  });
  it('should have an Access Model', () => {
    expect(model.access).toExist();
  });
});
