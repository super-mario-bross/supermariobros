const schema = require("../schema");
const { createReview } = require("../handlers/createReview");

module.exports = async function(fastify) {
  /**
   * create facility
   */
  fastify.route({
    method: "POST",
    url: "/review/add",
    schema: schema.createReview,
    handler: createReview(fastify)
  });
};
