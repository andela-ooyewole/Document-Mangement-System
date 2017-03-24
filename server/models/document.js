module.exports = (sequelize, DataTypes) => {
  const document = sequelize.define('document', {
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title field is empty'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Content field is empty'
        }
      }
    },
    access: {
      defaultValue: 'public',
      type: DataTypes.ENUM('public', 'private', 'role')
    }
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        document.hasMany(models.access, {
          foreignKey: 'documentId',
          as: 'accesses'
        });
        document.belongsTo(models.user, {
          foreignKey: 'userId',
          as: 'user'
        });
      }
    }
  });
  return document;
};
