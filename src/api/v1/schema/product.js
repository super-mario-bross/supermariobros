const getProductByIdSchema = {
  tags: ["Product"],
  response: {
    200: {
      type: "object",
      description: "Success product fetched",
      properties: {
        result: {
          type: "array",
          items: {
            type: "object",
            properties: {
              uuid: { type: "string" },
              entity_id: { type: "string" }
            }
          }
        }
      }
      // ...httpResponse
    }
  }
};

module.exports = {
  getProductByIdSchema
};
