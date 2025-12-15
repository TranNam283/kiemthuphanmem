// Sequelize CLI config (used by `sequelize-cli` for migrations)
// Keeps config.json defaults, but allows overriding via environment variables
// which is required for Railway/CI deployments.

const configJson = require("./config.json");

const env = process.env.NODE_ENV || "development";

const base = configJson[env] || configJson.development;

const fromEnv = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
};

module.exports = {
  development: {
    ...(configJson.development || {}),
  },
  test: {
    ...(configJson.test || {}),
  },
  production: {
    ...(configJson.production || {}),
    ...Object.fromEntries(
      Object.entries(fromEnv).filter(([, v]) => v !== undefined && v !== "")
    ),
  },
};
