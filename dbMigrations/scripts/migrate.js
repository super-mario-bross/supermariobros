"use strict";

const getPostgrator = require("./postgrator");
const ACTION = "do";

const log = require("pino")({
  level: "info",
  redact: { paths: ["DB_PASSWORD"], censor: "*****" },
  prettyPrint: { colorize: true }
});

/**
 * Creates the table with the help of migration files having `do` keyword
 * @param {obj} config
 */
const migrate = async config => {
  log.info(config);

  const postgrator = getPostgrator(config, ACTION);
  postgrator.on("migration-started", migration =>
    log.info({ migration }, "Migration started")
  );
  postgrator.on("migration-finished", migration =>
    log.info({ migration }, "Migration finished")
  );

  try {
    const appliedMigrations = await postgrator.migrate();
    log.info(
      `Migration completed for ${appliedMigrations.length} migration files`
    );
  } catch (err) {
    log.error("Error occured running DB scripts: migrate : ", err);
    process.exit(1);
  }
};

module.exports = migrate;
