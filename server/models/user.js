/* eslint-disable */
import bcrypt from 'bcryptjs';
/* eslint-enable */

export default (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'User name field is empty'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: {
          msg: 'Email field is empty'
        }
      }
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First name field is empty'
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last name field is empty'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password field is empty'
        }
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        user.hasMany(models.document, {
          foreignKey: 'userId',
          as: 'documents'
        });
        user.belongsTo(models.role, {
          foreignKey: 'roleId',
          as: 'role'
        });
      }
    },
    instanceMethods: {
      /**
       * verify plain password against user's hashed password
       * @method
       * @param {String} password password to be encrypted
       * @returns {Boolean} Validity of passowrd
       */
      verifyPassword(password) {
        return bcrypt.compareSync(password, this.password);
      }
    },
    hooks: {
      beforeCreate: (newUser) => {
        newUser.password = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync(10));
      },
      beforeUpdate: (newUser) => {
        newUser.password = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync(10));
      }
    }
  });
  return user;
};
