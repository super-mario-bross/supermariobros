const httpResponseBasicErrorSchema = {
  type: "object",
  description: "error response",
  additionalProperties: true,
  properties: {
    code: { type: "string" },
    message: { type: "string" },
    error: {
      type: "array",
      items: {
        type: "object",
        properties: {
          field: { type: "string" },
          message: { type: "string" }
        }
      }
    }
  }
};

module.exports = {
  httpResponseBasicErrorSchema,
  httpResponse: {
    400: httpResponseBasicErrorSchema,
    403: httpResponseBasicErrorSchema,
    404: httpResponseBasicErrorSchema,
    409: httpResponseBasicErrorSchema,
    500: httpResponseBasicErrorSchema
  }
};
