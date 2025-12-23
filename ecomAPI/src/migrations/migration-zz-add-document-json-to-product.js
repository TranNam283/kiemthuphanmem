"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm cột document kiểu JSON vào bảng Products (idempotent)
    const table = await queryInterface.describeTable("Products");
    if (table && table.document) {
      return;
    }
    await queryInterface.addColumn("Products", "document", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null,
      comment: "Document field for MongoDB-like storage",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa cột document khi rollback (idempotent)
    const table = await queryInterface.describeTable("Products");
    if (!table || !table.document) {
      return;
    }
    await queryInterface.removeColumn("Products", "document");
  },
};
