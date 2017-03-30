export default (sequelize, DataTypes) => {
  const role = sequelize.define('role', {
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title field is empty'
        }
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        role.hasMany(models.user, {
          foreignKey: 'roleId',
          as: 'users',
        });
      }
    }
  });
  return role;
};
