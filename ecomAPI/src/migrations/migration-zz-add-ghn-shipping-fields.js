"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add GHN shipping fields to Orderproducts table
    await queryInterface.addColumn("Orderproducts", "shipCode", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Orderproducts", "shippingProvider", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "internal",
    });
    await queryInterface.addColumn("Orderproducts", "ghnDistrictId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("Orderproducts", "ghnWardCode", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Orderproducts", "ghnAddress", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Orderproducts", "shippingFee", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Orderproducts", "shipCode");
    await queryInterface.removeColumn("Orderproducts", "shippingProvider");
    await queryInterface.removeColumn("Orderproducts", "ghnDistrictId");
    await queryInterface.removeColumn("Orderproducts", "ghnWardCode");
    await queryInterface.removeColumn("Orderproducts", "ghnAddress");
    await queryInterface.removeColumn("Orderproducts", "shippingFee");
  },
};
