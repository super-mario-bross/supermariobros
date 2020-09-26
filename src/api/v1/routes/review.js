const schema = require("../schema");
const { createReview } = require("../handlers/createReview");
const { getRatingsAndReviews } = require("../handlers/getReviewAndRatings");
const {
  updateReviewByUsersReaction
} = require("../handlers/updateReviewByUsersReaction");

module.exports = async function(fastify) {
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
    method: "PATCH",
    url: "/reviewAndRatings/updateReviewByUsersReaction",
    schema: schema.updateReviewByUsersReaction,
    handler: updateReviewByUsersReaction(fastify)
  });
};
