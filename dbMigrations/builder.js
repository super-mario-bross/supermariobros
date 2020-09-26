const Postgrator = require("postgrator");
const path = require("path");

const postgratorBuilder = {
  build: (config, action) =>
    new Postgrator({
      migrationDirectory: path.resolve(
        process.cwd(),
        "./dbMigrations/migrations"
      ),
      schemaTable: "schemaversion",
      driver: "pg",
      host: config.DB_HOST,
      port: config.DB_PORT,
      database: config.DB_NAME,
      username: config.DB_USER,
      password: config.DB_PASSWORD,
      currentSchema: config.DB_SCHEMA || undefined,
      action
    })
};

module.exports = { postgratorBuilder };
