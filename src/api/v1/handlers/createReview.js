const { BAD_REQUEST, CREATED } = require("http-status-codes");
const errorHandlerFactory = require("../../../utilities/responseHandler/errorHandler");
var Sentiment = require("sentiment");
var sentiment = new Sentiment();

/**
 * create review with ratings,title, description
 * @param {*} fastify instance
 */
module.exports.createReview = fastify => async (request, reply) => {
  const { serviceErrorHandler } = errorHandlerFactory(fastify);

  /**
   * Validate product_id
   */
  const entity = await fastify.reviewRepository.getEntityById(
    request.logTrace,
    request.body.entity
  );

  if (request.body.reviewDesc) {
    request.body.sentimentScore = sentiment.analyze(
      request.body.reviewDesc
    ).score;
  }

  if (!entity.length) {
    return serviceErrorHandler(BAD_REQUEST, "INVALID_ENTITY_ID", {
      entity_id: entity
    });
  }
  let dataToCreate = {
    entity: request.body.entity,
    author: request.body.author,
    title: request.body.title ? request.body.title : null,
    reviewDesc: request.body.reviewDesc ? request.body.reviewDesc : null,
    rating: request.body.rating,
    sentimentScore: request.body.sentimentScore
      ? request.body.sentimentScore
      : 0
  };

  const reviewData = await fastify.reviewRepository.create(
    request.logTrace,
    dataToCreate
  );
  reply.code(CREATED).send(dataToCreate);
};
