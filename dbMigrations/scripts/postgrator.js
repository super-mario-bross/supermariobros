const Postgrator = require("postgrator");
const path = require("path");

const getPostgrator = (config, action) => {
  return new Postgrator({
    migrationDirectory: path.join(__dirname, "../migrations"),
    schemaTable: "schemaversion",
    driver: "pg",
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    currentSchema: config.DB_SCHEMA,
    action
  });
};

module.exports = getPostgrator;
