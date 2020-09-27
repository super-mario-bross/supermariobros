const productSchema = require("../schema/product");
const { getProductById } = require("../handlers/getProductById");

module.exports = async function(fastify) {
  fastify.route({
    method: "GET",
    url: "/product",
    schema: productSchema.getProductById,
    handler: getProductById(fastify)
  });
};
