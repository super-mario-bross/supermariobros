const schema = require("../schema");
const { createReview } = require("../handlers/createReview");
const { getRatingsAndReviews } = require("../handlers/getReviewAndRatings");
const { updateIsHelpful } = require("../handlers/updateIsHelpful");


module.exports = async function(fastify) {
  /**
   * create facility
   */
  fastify.route({
    method: "POST",
    url: "/reviewAndRatings",
    schema: schema.createReview,
    handler: createReview(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/reviewAndRatings",
    schema: schema.getReviewsAndRatings,
    handler: getRatingsAndReviews(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/reviewAndRatings/updateIsHelpful",
    schema: schema.updateIsHelpful,
    handler: updateIsHelpful(fastify)
  });
};
