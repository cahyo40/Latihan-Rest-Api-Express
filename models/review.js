'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Review.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' })
      Review.belongsTo(models.User, { foreignKey: 'users_id', as: 'user_review' })
    }
  }
  Review.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    users_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'users_id is required',
        },
        isExist: (value) => {
          return sequelize.models.User.findOne({
            where: {
              id: value
            }
          }).then((err) => {
            if (!err) {
              throw new Error('User not found');
            }
          })
        }
      }
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'product_id is required',
        },
        isExist: (value) => {
          return sequelize.models.Product.findOne({
            where: {
              id: value
            }
          }).then((err) => {
            if (!err) {
              throw new Error('Product not found');
            }
          })
        }
      }
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'point is required',
        },
        min: {
          args: [1],
          msg: 'point must be greater than 1',
        },
        max: {
          args: [5],
          msg: 'point must be less than 5',
        },
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'content is required',
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};