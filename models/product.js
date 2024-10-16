'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' })
      Product.hasMany(
        models.Review, 
        { foreignKey: 'product_id', as: 'reviewer_product' }
      )
    }
  }
  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is required",
        }
      }
    },
    description: DataTypes.STRING,
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price is required",
        }
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Category is required",
        },
        isExist(value) {
          return sequelize.models.Category.findByPk(value).then(category => {
            if (!category) {
              throw new Error("Category not found");
            }
          })
        },
        isInt: true,
      },


    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Image is required",
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    count_review: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    avg_review: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};