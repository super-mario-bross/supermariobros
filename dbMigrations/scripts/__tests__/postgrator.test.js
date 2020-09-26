const postgrator = require("postgrator");
const path = require("path");

const getPostgrator = require("../postgrator");

jest.mock("path");
jest.mock("postgrator");

describe("Generate Postgrator", () => {
  const config = {
    DB_HOST: "//test",
    DB_PORT: "5432",
    DB_NAME: "testDb",
    DB_USER: "testUser",
    DB_PASSWORD: "testPwd",
    DB_SCHEMA: "catalog"
  };
  const action = "do";

  it("should instantiate postgrator with config", () => {
    const migrationDirectory = "./../migrations";
    path.join = jest.fn(() => migrationDirectory);

    getPostgrator(config, action);

    const {
      DB_HOST,
      DB_PORT,
      DB_NAME,
      DB_SCHEMA,
      DB_USER,
      DB_PASSWORD
    } = config;

    const expectedConfig = {
      migrationDirectory,
      schemaTable: "schemaversion",
      driver: "pg",
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
      username: DB_USER,
      password: DB_PASSWORD,
      currentSchema: DB_SCHEMA,
      action
    };
    expect(postgrator).toHaveBeenCalledWith(expectedConfig);
  });
});
