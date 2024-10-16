'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profile.init({
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notEmpty: {
          msg: 'Age is required'
        },
        notNull: {
          msg: 'Age is required'
        },
        isInt: {
          msg: 'Age must be an integer'
        }
      }
    },
    bio: {
      type: DataTypes.TEXT,
      
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Address is required'
        },
        notNull: {
          msg: 'Address is required'
        }
      }
    },
    users_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'User ID is required'
        },
        notNull: {
          msg: 'User ID is required'
        },
        isExist(value){
          return sequelize.models.User.findOne({
            where: {
              id: value
            }
          }).then((user) => {
            if (!user) {
              throw new Error('User ID does not exist');  
            }
          });
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};