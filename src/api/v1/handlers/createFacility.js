const { BAD_REQUEST, CREATED } = require("http-status-codes");
const errorHandlerFactory = require("../../../utilities/responseHandler/errorHandler");

/**
 * create facility with Address,attributes
 * @param {*} fastify instance
 */
module.exports.createFacility = fastify => async (request, reply) => {
  const { serviceErrorHandler } = errorHandlerFactory(fastify);
  const { id } = request.params;
  /**
   * Validate Seller
   */
  const seller = await fastify.sellerRepository.getSellerByIdAndTenant(
    request.logTrace,
    id,
    request.headers["tenant"]
  );
  if (!seller.length) {
    return serviceErrorHandler(BAD_REQUEST, "INVALID_SELLER_ID", {
      sellerId: id,
      tenantId: request.headers["tenant"]
    });
  }
  /**
   * create facility,address with contacts, attributes
   */
  await fastify.logisticsRepository.createFacility(
    request.logTrace,
    seller[0].uuid,
    request.body,
    request.headers["tenant"]
  );
  reply.code(CREATED).send();
};
