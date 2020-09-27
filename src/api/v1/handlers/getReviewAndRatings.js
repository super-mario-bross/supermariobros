const { BAD_REQUEST, OK } = require("http-status-codes");
const errorHandlerFactory = require("../../../utilities/responseHandler/errorHandler");
/**
 * create review with ratings,title, description
 * @param {*} fastify instance
 */

module.exports.getRatingsAndReviews = fastify => async (request, reply) => {
  const { serviceErrorHandler } = errorHandlerFactory(fastify);
  const { entityId } = request.query;

  /**
   * Validate product_id
   */
  const entity = await fastify.entityRepository.getEntityByProductId(
    request.logTrace,
    entityId
  );

  if (!entity.length) {
    return serviceErrorHandler(BAD_REQUEST, "INVALID_ENTITY_ID", {
      entity_id: entityId
    });
  }
  request.query.entityId = entity[0].uuid;
  let countInfo = await fastify.reviewRepository.getReviewAndRatingCount(
    request.logTrace,
    request.query
  );
  let reviewAndRatingsInfo = await fastify.reviewRepository.getReviewAndRatingByEntity(
    request.logTrace,
    request.query
  );

  const dataToSend = {
    summaryData: entity[0],
    reviewAndRatingsInfo,
    paginationInfo: {
      total: countInfo[0].count
    }
  };

  reply.code(OK).send(dataToSend);
};
