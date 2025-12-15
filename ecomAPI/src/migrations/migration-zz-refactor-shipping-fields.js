"use strict";

/**
 * Migration: Refactor GHN-specific fields to generic shippingData JSON
 *
 * This migration:
 * 1. Migrates existing GHN data (ghnDistrictId, ghnWardCode, ghnAddress) into shippingData JSON
 * 2. Removes the GHN-specific columns
 *
 * The shippingData JSON field supports multiple shipping providers:
 * - GHN: { provider: "GHN", districtId, wardCode, address, ... }
 * - GHTK: { provider: "GHTK", pickMoney, isFreeship, ... }
 * - ViettelPost: { provider: "ViettelPost", ... }
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Migrate existing GHN data into shippingData JSON
    await queryInterface.sequelize.query(`
      UPDATE Orderproducts 
      SET shippingData = JSON_OBJECT(
        'provider', COALESCE(shippingProvider, 'GHN'),
        'districtId', ghnDistrictId,
        'wardCode', ghnWardCode,
        'address', ghnAddress,
        'shipCode', shipCode,
        'shippingFee', shippingFee,
        'migratedAt', NOW()
      )
      WHERE (ghnDistrictId IS NOT NULL OR ghnWardCode IS NOT NULL OR ghnAddress IS NOT NULL)
        AND shippingData IS NULL
    `);

    // Step 2: For orders that already have shippingProvider but no GHN fields
    // Just update the shippingData with basic info
    await queryInterface.sequelize.query(`
      UPDATE Orderproducts 
      SET shippingData = JSON_OBJECT(
        'provider', COALESCE(shippingProvider, 'internal'),
        'shipCode', shipCode,
        'shippingFee', shippingFee,
        'migratedAt', NOW()
      )
      WHERE shippingData IS NULL 
        AND (shippingProvider IS NOT NULL OR shipCode IS NOT NULL OR shippingFee IS NOT NULL)
    `);

    // Step 3: Remove GHN-specific columns
    await queryInterface.removeColumn("Orderproducts", "ghnDistrictId");
    await queryInterface.removeColumn("Orderproducts", "ghnWardCode");
    await queryInterface.removeColumn("Orderproducts", "ghnAddress");

    // Step 4: Remove redundant columns (now stored in shippingData)
    await queryInterface.removeColumn("Orderproducts", "shipCode");
    await queryInterface.removeColumn("Orderproducts", "shippingProvider");
    await queryInterface.removeColumn("Orderproducts", "shippingFee");
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add the columns
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

    // Restore data from shippingData JSON back to columns
    await queryInterface.sequelize.query(`
      UPDATE Orderproducts 
      SET 
        shipCode = JSON_UNQUOTE(JSON_EXTRACT(shippingData, '$.shipCode')),
        shippingProvider = JSON_UNQUOTE(JSON_EXTRACT(shippingData, '$.provider')),
        ghnDistrictId = JSON_EXTRACT(shippingData, '$.districtId'),
        ghnWardCode = JSON_UNQUOTE(JSON_EXTRACT(shippingData, '$.wardCode')),
        ghnAddress = JSON_UNQUOTE(JSON_EXTRACT(shippingData, '$.address')),
        shippingFee = JSON_EXTRACT(shippingData, '$.shippingFee')
      WHERE shippingData IS NOT NULL
    `);
  },
};
