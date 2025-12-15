"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductDetailSize extends Model {
    static associate(models) {
      ProductDetailSize.belongsTo(models.Allcode, {
        foreignKey: "sizeId",
        targetKey: "code",
        as: "sizeData",
        constraints: false,
        foreignKeyConstraints: false,
      });
    }
  }
  ProductDetailSize.init(
    {
      productdetailId: DataTypes.INTEGER,
      width: DataTypes.STRING,
      height: DataTypes.STRING,
      weight: DataTypes.STRING,
      sizeId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProductDetailSize",
      // Keep consistent with existing table naming in DB/seed (Productdetailsizes)
      tableName: "Productdetailsizes",
    }
  );
  return ProductDetailSize;
};
