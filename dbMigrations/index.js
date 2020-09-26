const Config = require("./config");
const { postgratorBuilder } = require("./builder");

const config = Config();

const migrationVersion = config.DB_MIGRATION_VERSION;

const postgrator = postgratorBuilder.build(config, "do");

postgrator.on("migration-started", () => {
  console.log(`Version: ${migrationVersion}`);
  console.info("Migration started");
});
postgrator.on("migration-finished", () => console.info("Migration finished"));

const executeMigration = async () => {
  if (!migrationVersion) {
    throw new Error(`Migration version ${migrationVersion} is unknow`);
  }

  const migrationResult = await postgrator
    .migrate(migrationVersion)
    .catch(error => {
      throw new Error(`Migration failed: ${error}`);
    });

  console.info(
    `Migration completed for ${migrationResult.length} migration files`
  );
};

executeMigration();
