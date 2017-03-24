module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('accesses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true,
        }
      },
      canEdit: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      documentId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'documents',
          key: 'id',
          as: 'document'
        }
      }
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('accesses');
  }
};
