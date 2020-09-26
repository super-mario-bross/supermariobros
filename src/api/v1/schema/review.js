const { httpResponse } = require("./http-responses");

const createReview = {
  tags: ["Reviews & Rating"],
  response: {
    200: {
      type: "object",
      description: "Success review created response",
      properties: {
        entity: { type: "string" },
        author: { type: "number" },
        title: { type: "string" },
        reviewDesc: { type: "string" },
        rating: { type: "number", maximum: 5, minimum: 1 },
        sentimentScore: { type: "string" },
        uuid: { type: "string" }
      },
      ...httpResponse
    }
  },
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
  tags: ["Reviews & Rating"],
  response: {
    200: {
      type: "object",
      description: "get reviews by query strings"
    },
    ...httpResponse
  },
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
  tags: ["Reviews & Rating"],
  response: {
    200: {
      type: "object",
      description: "Succesfully updated review"
    },
    ...httpResponse
  },
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
