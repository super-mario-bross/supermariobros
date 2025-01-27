const { BAD_REQUEST, CREATED } = require("http-status-codes");
const errorHandlerFactory = require("../../../utilities/responseHandler/errorHandler");
const { calculateRating } = require("../../../utilities/ratingCalculator");
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
  const entity = await fastify.entityRepository.getEntityByProductId(
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
      entity_id: request.body.entity
    });
  }
  request.body.entity = entity[0].uuid;

  let dataToCreate = {
    entity: request.body.entity,
    author: request.body.author,
    title: request.body.title ? request.body.title : null,
    reviewDesc: request.body.reviewDesc ? request.body.reviewDesc : null,
    rating: request.body.rating,
    sentimentScore: request.body.sentimentScore
      ? request.body.sentimentScore
      : 0,
    isHelpful: request.body.isHelpful
  };
  if (request.body.sentimentScore < -3) {
    dataToCreate.moderationStatus = "pending";
  } else {
    dataToCreate.moderationStatus = "auto";
  }

  dataToCreate.isPublished =
    dataToCreate.moderationStatus === "pending" ? false : true;

  await fastify.reviewRepository.create(request.logTrace, dataToCreate);
  let entityInfo = await fastify.reviewRepository.getReviewAndRatingByEntity(
    request.logTrace,
    { entityId: request.body.entity }
  );
  const calculatedRatings = calculateRating(entityInfo);
  await fastify.entityRepository.updateEntityById(
    request.logTrace,
    Object.assign(calculatedRatings[request.body.entity], {
      entity_id: request.body.entity
    })
  );
  reply.code(CREATED).send(dataToCreate);
};
