const migrate = require("../migrate");
const getPostgrator = require("../postgrator");
jest.mock("../postgrator");

describe("Migrate", () => {
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
    migrate(config);

    expect(getPostgrator).toHaveBeenCalledWith(config, "do");
  });

  it("should invoke migrate of postgrator", async () => {
    await migrate(config);

    expect(postgrator.migrate).toHaveBeenCalled();
  });

  it("should stop migration on failure", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

    postgrator = {
      on: jest.fn(),
      migrate: jest.fn(() => Promise.reject(false))
    };
    getPostgrator.mockImplementation(() => postgrator);

    await migrate(config);

    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
