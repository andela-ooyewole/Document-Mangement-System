module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
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
      associate: () => {
        // associations can be defined here
      }
    }
  });
  return Role;
};
