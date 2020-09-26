const createReview = {
  body: {
    type: "object",
    required: ["entity", "rating", "author"],
    properties: {
      entity: { type: "string" },
      author: { type: "number" },
      title: { type: "string" },
      reviewDesc: { type: "string" },
      rating: { type: "number", maximum: 5, minimum: 1 }
    },
    additionalProperties: false
  }
};

module.exports = {
  createReview
};
