const envSchema = require("env-schema");

const schema = {
  type: "object",
  required: [
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "DB_MIGRATION_VERSION"
  ],
  properties: {
    DB_HOST: { type: "string" },
    DB_PORT: { type: "string" },
    DB_NAME: { type: "string" },
    DB_USER: { type: "string" },
    DB_PASSWORD: { type: "string" },
    DB_SCHEMA: { type: "string" },
    DB_MIGRATION_VERSION: { type: "string" }
  }
};

module.exports = () => {
  const config = envSchema({ schema, dotenv: true });

  return config;
};
