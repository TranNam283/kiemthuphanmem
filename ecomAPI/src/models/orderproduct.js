"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderProduct.belongsTo(models.TypeShip, {
        foreignKey: "typeShipId",
        targetKey: "id",
        as: "typeShipData",
      });
      OrderProduct.belongsTo(models.Allcode, {
        foreignKey: "statusId",
        targetKey: "code",
        as: "statusOrderData",
        constraints: false,
        foreignKeyConstraints: false,
      });
      OrderProduct.belongsTo(models.Voucher, {
        foreignKey: "voucherId",
        targetKey: "id",
        as: "voucherData",
      });
    }
  }
  OrderProduct.init(
    {
      addressUserId: DataTypes.INTEGER,
      statusId: DataTypes.STRING,
      typeShipId: DataTypes.INTEGER,
      voucherId: DataTypes.INTEGER,
      note: DataTypes.STRING,
      isPaymentOnlien: DataTypes.INTEGER,
      image: DataTypes.BLOB("long"),

      /**
       * Flexible shipping data JSON field
       * Supports multiple shipping providers with provider-specific data:
       *
       * GHN (Giao Hàng Nhanh):
       * {
       *   provider: "GHN",
       *   districtId: 1454,
       *   wardCode: "21012",
       *   address: "123 Nguyen Van Linh",
       *   shipCode: "GHN123456",
       *   shippingFee: 30000,
       *   expectedDelivery: "2025-12-05"
       * }
       *
       * GHTK (Giao Hàng Tiết Kiệm):
       * {
       *   provider: "GHTK",
       *   pickMoney: 0,
       *   isFreeship: 1,
       *   shipCode: "GHTK789",
       *   shippingFee: 25000
       * }
       *
       * ViettelPost:
       * {
       *   provider: "ViettelPost",
       *   senderDistrictId: 1,
       *   receiverDistrictId: 2,
       *   shipCode: "VP456",
       *   shippingFee: 28000
       * }
       */
      shippingData: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "OrderProduct",
      tableName: "Orderproducts",
    }
  );
  return OrderProduct;
};
