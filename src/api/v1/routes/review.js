const schema = require("../schema");
const { createFacility } = require("../handlers/createFacility");


module.exports = async function(fastify) {
  /**
   * create facility
   */
  fastify.route({
    method: "POST",
    url: "/sellers/:id/logistics/facilities",
    schema: schema.createFacility,
    handler: createFacility(fastify)
  });
};
