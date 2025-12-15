"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm cột document kiểu JSON vào bảng Products
    await queryInterface.addColumn("Products", "document", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null,
      comment: "Document field for MongoDB-like storage",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa cột document khi rollback
    await queryInterface.removeColumn("Products", "document");
  },
};
