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
    additionalProp1Properties: false
  }
};

const getReviewsAndRatings = {
  tags: ["Reviews & Rating"],
  response: {
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

const updateReviewByUsersReaction = {
  tags: ["Reviews & Rating"],
  response: {
    200: {
      type: "object",
      description: "Succesfully updated user reaction to review",
      properties: {
        reviewId: { type: "string" },
        userReaction: {
          type: "string",
          enum: ["is_helpful", "is_not_helpful"]
        }
      }
    },
    ...httpResponse
  },
  body: {
    type: "object",
    required: ["reviewId", "userReaction"],
    properties: {
      reviewId: { type: "string" },
      userReaction: { type: "string", enum: ["is_helpful", "is_not_helpful"] }
    }
  }
};

module.exports = {
  createReview,
  getReviewsAndRatings,
  updateReviewByUsersReaction
};
