const { OK } = require("http-status-codes");
const { create } = require("../../../index");

describe("product handler", () => {
  let fastify;
  beforeAll(async () => {
    fastify = create();
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });
  test("should get product info", async done => {
    const response = await fastify.inject({
      method: "GET",
      url: "v1/product?product_id=123456",
      accept: "application/json"
    });
    expect(response.statusCode).toBe(OK);
    done();
  });
});
