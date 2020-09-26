const fp = require("fastify-plugin");
const fastifyPostgres = require("fastify-postgres");
const pg = require("pg");
const pgCamelCase = require("pg-camelcase");
pgCamelCase.inject(pg);

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_MAX_CONNECTION_WRITE,
  DB_CONNECTION_TIMEOUT,
  DB_STATEMENT_TIMEOUT
} = process.env;

module.exports = fp(async fastify => {
  fastify.register(fastifyPostgres, {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    pg: pg,
    max: DB_MAX_CONNECTION_WRITE,
    connectionTimeoutMillis: Math.trunc(DB_CONNECTION_TIMEOUT),
    statementTimeout: Math.trunc(DB_STATEMENT_TIMEOUT)
  });
});
