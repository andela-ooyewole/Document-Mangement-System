module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      access: {
        defaultValue: 'public',
        type: Sequelize.ENUM('public', 'private', 'role')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
          as: 'user'
        }
      }
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('documents');
  }
};
