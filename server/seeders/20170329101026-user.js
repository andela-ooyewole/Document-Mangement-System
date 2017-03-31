const bcrypt = require('bcryptjs');

module.exports = {
  up(queryInterface) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('users', [{
      username: 'femi_oyewole',
      email: 'olufemi.oyewole@andela.com',
      firstname: 'Olufemi',
      lastname: 'Oyewole',
      password: bcrypt.hashSync('password', bcrypt.genSaltSync(10)),
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: 1
    }], {});
  },

  down(queryInterface) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('users', null, {});
  }
};
