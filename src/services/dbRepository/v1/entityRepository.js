const fp = require("fastify-plugin");

const errorHandlerFactory = require("../../../utilities/responseHandler/errorHandler");
const queries = require("./queryBuilder/entitiesQueries");

module.exports = fp(function entity(fastify, options, next) {
  const { dbError } = errorHandlerFactory(fastify);

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

  const updateEntityById = async (logTrace, data, client = fastify.pg) => {
    fastify.log.debug({
      traceHeaders: logTrace,
      message: `Invoking repository to update Entity by entity_id ${data.entity_id}`
    });
    try {
      const sql = queries.updateEntityById(data);
      const result = await client.query(sql);
      return result.rows;
    } catch (err) {
      fastify.log.error({
        traceHeaders: logTrace,
        message: "Request Failed for updating  Entity by entity_id",
        data: `${data.entity_id}`,
        err
      });
      throw dbError(err);
    }
  };

  fastify.decorate("entityRepository", {
    getEntityById,
    updateEntityById
  });

  next();
});
