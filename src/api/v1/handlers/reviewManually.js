const { BAD_REQUEST, OK } = require("http-status-codes");
const errorHandlerFactory = require("../../../utilities/responseHandler/errorHandler");
/**
 * create review with ratings,title, description
 * @param {*} fastify instance
 */

module.exports.reviewManually = fastify => async (request, reply) => {
  const { serviceErrorHandler } = errorHandlerFactory(fastify);
  const { reviewId } = request.body;

  /**
   * Validate product_id
   */
  const review = await fastify.reviewRepository.getReviewById(
    request.logTrace,
    reviewId
  );

  if (!review.length) {
    return serviceErrorHandler(BAD_REQUEST, "INVALID_REVIEW_ID", {
      review_id: reviewId
    });
  }

  await fastify.reviewRepository.reviewManually(request.logTrace, request.body);
  reply.code(OK).send(request.body);
};
