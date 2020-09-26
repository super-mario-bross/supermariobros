"use strict";

const v1Routes = require("./routes");

/**
 * Register all version routes
 */
module.exports = async function routes(fastify) {
  fastify.register(v1Routes, { prefix: "/seller/v1" });
};
