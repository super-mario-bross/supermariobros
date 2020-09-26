const undoMigrate = require("../undoMigrate");
const getPostgrator = require("../postgrator");
jest.mock("../postgrator");

describe("Undo migrate", () => {
  const config = { DB_NAME: "test" };
  let postgrator;

  beforeEach(() => {
    postgrator = {
      on: jest.fn((name, cb) => cb()),
      migrate: jest.fn(() => Promise.resolve(["01.sql", "02.sql"]))
    };
    getPostgrator.mockImplementation(() => postgrator);
  });

  afterEach(() => {
    getPostgrator.mockReset();
  });

  it("should initiate postgrator with config", () => {
    undoMigrate(config);

    expect(getPostgrator).toHaveBeenCalledWith(config, "undo");
  });

  it("should invoke migrate of postgrator", async () => {
    await undoMigrate(config);

    expect(postgrator.migrate).toHaveBeenCalledWith("000");
  });

  it("should stop migration on failure", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

    postgrator = {
      on: jest.fn(),
      migrate: jest.fn(() => Promise.reject(false))
    };
    getPostgrator.mockImplementation(() => postgrator);

    await undoMigrate(config);

    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
