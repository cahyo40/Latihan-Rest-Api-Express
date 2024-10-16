'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: 'users_id', as: 'profile_user' });
      User.belongsToMany(
        models.Product,
        {
          foreignKey: 'users_id',
          as: 'history_review',
          otherKey: 'product_id',
          through: {
            model: 'reviews',
            unique: false,
          }
        }
      );
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      }
    }, roleId: {
      type: DataTypes.UUID,
    }
  }, {
    hooks: {
      beforeCreate: async (user, options) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
        if (!user.roleId) {
          const { Role } = sequelize.models;
          const role_users = await Role.findOne({ where: { name: "User" } });
          if (role_users) {
            user.roleId = role_users.id;
          } else {
            throw new Error("Role User not found");
          }
        }
      },
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};