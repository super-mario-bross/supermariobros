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

const getReviewsAndRatings = {
  querystring: {
    type: "object",
    required: ["entity_id"],
    properties: {
      entity_id: { type: "string" },
      limit: { type: "string" },
      offset: { type: "string" },
      sort_key: {
        type: "string",
        enum: ["created_at", "is_helpful", "is_not_helpful", "rating"]
      },
      sort_order: { type: "string", enum: ["ASC", "DESC"] },
      filterByRating: { type: "string", maximum: 5, minimum: 1 }
    },
    additionalProperties: false
  }
};

const updateIsHelpful = {
  body: {
    type: "object",
    required: ["reviewId", "isHelpful"],
    properties: {
      reviewId: { type: "string" },
      isHelpful: { type: "boolean" }
    },
    additionalProperties: false
  }
};

module.exports = {
  createReview,
  getReviewsAndRatings,
  updateIsHelpful
};
