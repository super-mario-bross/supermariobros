const fp = require("fastify-plugin");
const uuidv5 = require("uuid/v5");

const errorHandlerFactory = require("../../../utilities/responseHandler/errorHandler");

module.exports = fp(function attributes(fastify, options, next) {
  const { dbError } = errorHandlerFactory(fastify);
  const computeUUIDv5 = attribute => {
    attribute.uuid = uuidv5(
      `${attribute.seller_id}-${attribute.tenantId}-${attribute.groupName}`,
      uuidv5.URL
    );
    return attribute;
  };
  const create = async (logTrace, attribute, client = fastify.pg) => {
    fastify.log.debug({
      traceHeaders: logTrace,
      message: `Invoking repository to create Seller attributes - ${attribute.seller_id}`
    });
    try {
      computeUUIDv5(attribute);
      const sql = queries.insertAttributesQuery(attribute);
      const result = await client.query(sql);
      fastify.log.debug({
        traceHeaders: logTrace,
        data: result.rows,
        message: "Seller Attributes Insert Request completed"
      });
      return result.rows;
    } catch (err) {
      fastify.log.error({
        traceHeaders: logTrace,
        message: "Request Failed for Insert Seller Attributes",
        data: attribute,
        err
      });
      throw dbError(err);
    }
  };

  fastify.decorate("attributesRepository", {
    create
  });

  next();
});
