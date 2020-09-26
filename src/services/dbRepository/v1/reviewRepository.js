const fp = require("fastify-plugin");

const uuidv4 = require("uuid/v4");

const errorHandlerFactory = require("../../../utilities/responseHandler/errorHandler");
const queries = require("./queryBuilder/reviewQueries");

module.exports = fp(function reviewAndRatings(fastify, options, next) {
  const { dbError } = errorHandlerFactory(fastify);

  const create = async (logTrace, reviewData, client = fastify.pg) => {
    fastify.log.debug({
      traceHeaders: logTrace,
      message: `Invoking repository to create review  - ${reviewData.entity}`
    });
    try {
      reviewData.uuid = uuidv4();
      const sql = queries.insertReviewsBulk([reviewData]);
      const result = await client.query(sql);
      fastify.log.debug({
        traceHeaders: logTrace,
        data: result.rows,
        message: "Review and Ratings Insert Request completed"
      });
      return result.rows;
    } catch (err) {
      fastify.log.error({
        traceHeaders: logTrace,
        message: "Request Failed for Insert Review and Ratings",
        data: reviewData.entity,
        err
      });
      throw dbError(err);
    }
  };

  const getEntityById = async (logTrace, id, client = fastify.pg) => {
    fastify.log.debug({
      traceHeaders: logTrace,
      message: `Invoking repository to get Entity by entity_id ${id}`
    });
    try {
      const sql = queries.entityByIdQuery(id);
      const result = await client.query(sql);
      return result.rows;
    } catch (err) {
      fastify.log.error({
        traceHeaders: logTrace,
        message: "Request Failed for getting  Entity by entity_id",
        data: `${id}`,
        err
      });
      throw dbError(err);
    }
  };

  const getReviewAndRatingByEntity = async (logTrace, options, client = fastify.pg) => {
    fastify.log.debug({
      traceHeaders: logTrace,
      message: `Invoking repository to get review and ratings by entity_id ${options.entity_id}`
    });
    try {
      const sql = queries.reviewAndRatingByEntityQuery(options);
      const result = await client.query(sql);
      return result.rows;
    } catch (err) {
      fastify.log.error({
        traceHeaders: logTrace,
        message: "Request Failed for getting  review and ratings by entity_id",
        data: `${options.entity_id}`,
        err
      });
      throw dbError(err);
    }
  };

  fastify.decorate("reviewRepository", {
    create,
    getEntityById,
    getReviewAndRatingByEntity
  });

  next();
});
