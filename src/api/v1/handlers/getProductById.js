const { OK } = require("http-status-codes");
const {
  getAllEntities
} = require("./../../../services/dbRepository/v1/queryBuilder/entitiesQueries");
/**
 * create review with ratings,title, description
 * @param {*} fastify instance
 */

module.exports.getProductById = fastify => async (request, reply) => {
  const productData = (await fastify.pg.query(getAllEntities())).rows.map(
    data => {
      return {
        uuid: data.uuid,
        entity_id: data.entityId
      };
    }
  );
  reply.code(OK).send({
    result: productData
  });
};
