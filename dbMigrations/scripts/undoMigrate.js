"use strict";

const getPostgrator = require("./postgrator");
const INIT_VERSION = "000";
const ACTION = "undo";

const log = require("pino")({
  level: "info",
  redact: { paths: ["DB_PASSWORD"], censor: "*****" },
  prettyPrint: { colorize: true }
});

/**
 * drops the table with the help of migration files having `undo` keyword
 * @param {obj} config
 */
const undoMigrate = async config => {
  log.info(config);

  const postgrator = getPostgrator(config, ACTION);
  postgrator.on("migration-started", migration =>
    log.info({ migration }, "Undo migration started")
  );
  postgrator.on("migration-finished", migration =>
    log.info({ migration }, "Undo migration finished")
  );

  try {
    const appliedMigrations = await postgrator.migrate(INIT_VERSION);
    log.info(
      `Undo migration Completed for ${appliedMigrations.length} migration files`
    );
  } catch (err) {
    log.error("Error occured running DB scripts: undoMigrate : ", err);
    process.exit(1);
  }
};

module.exports = undoMigrate;
