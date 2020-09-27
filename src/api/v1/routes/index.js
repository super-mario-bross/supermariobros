module.exports = async function(fastify) {
  require("./review")(fastify);
  require("./product")(fastify);
};
