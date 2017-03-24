module.exports = (sequelize, DataTypes) => {
  const access = sequelize.define('access', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: {
          msg: 'Email field is empty'
        }
      }
    },
    canEdit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      }
    }
  });
  return access;
};
