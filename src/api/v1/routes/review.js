const schema = require("../schema");
const { createReview } = require("../handlers/createReview");
const { getRatingsAndReviews } = require("../handlers/getReviewAndRatings");

module.exports = async function(fastify) {
  /**
   * create facility
   */
  fastify.route({
    method: "POST",
    url: "/review/add",
    schema: schema.createReview,
    handler: createReview(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/review/all",
    schema: schema.getReviewsAndRatings,
    handler: getRatingsAndReviews(fastify)
  });
};
