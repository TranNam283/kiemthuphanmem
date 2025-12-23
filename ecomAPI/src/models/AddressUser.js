"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AddressUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  AddressUser.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      email: DataTypes.STRING,
      phonenumber: DataTypes.STRING,
      // Standardized Vietnamese address fields (provider-agnostic)
      provinceName: DataTypes.STRING,
      districtName: DataTypes.STRING,
      wardName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AddressUser",
      tableName: "addressusers",
    }
  );
  return AddressUser;
};
