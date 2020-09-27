const { httpResponse } = require("./http-responses");

const getProductById = {
  tags: ["Product"],
  response: {
    200: {
      type: "object",
      description: "Success product fetched",
      properties: {
        product_id: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        price: { type: "string" },
        image: { type: "string" }
      },
      ...httpResponse
    }
  },
  querystring: {
    type: "object",
    required: ["product_id"],
    properties: {
      product_id: { type: "string" }
    },
    additionalProperties: false
  }
};

module.exports = {
  getProductById
};
