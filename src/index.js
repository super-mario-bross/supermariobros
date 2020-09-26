"use strict";

if (process.env.KIBANA_ENABLED === "true") {
  require("elastic-apm-node").start();
}

require("dotenv").config();
const core = require("@ci-reuse/fastify-core");
const autoload = require("fastify-autoload");
const path = require("path");
const postgres = require("./plugins/postgres");
const Ajv = require("ajv");

const fs =
  process.env.NODE_ENV === "development" &&
  require("@ci-reuse/fastify-swagger");

const ajv = new Ajv({
  removeAdditional: false,
  useDefaults: true,
  coerceTypes: false,
  allErrors: true,
  jsonPointers: true
});

require("ajv-keywords")(ajv, ["uniqueItemProperties"]);
require("ajv-errors")(ajv);

const init = () => {
  const fastify = core.createServer({ histogram: { ignorePathParams: true } });
  fastify.setSchemaCompiler(schema => ajv.compile(schema));
  fastify.addHook("onRequest", (request, reply, next) => {
    request.logTrace = {
      "x-request-id": request.headers["x-request-id"],
      "x-b3-traceid": request.headers["x-b3-traceid"]
    };
    next();
  });

  // fastify.setSchemaCompiler(schema => ajv.compile(schema));
  fastify.register(autoload, {
    dir: path.join(__dirname, "services/dbRepository"),
    ignorePattern: /^(__tests__|queryBuilder)/
  });

  // add swagger docs if NODE_ENV===development
  fs &&
    fastify.register(
      fs.swaggerPlugin({
        swagger: {
          schemes: ["http", "https"]
        }
      })
    );

  fastify.register(autoload, {
    dir: path.join(__dirname, "api"),
    ignorePattern: /^(__tests__|schema)/
  });

  const responseTimeout = Math.trunc(process.env.TIMEOUT_SERVER) || 120000;
  fastify.server.setTimeout(responseTimeout);

  return fastify;
};

const create = () => {
  const fastify = init();

  fastify.register(postgres);
  fastify.addHook("onSend", (request, reply, payload, next) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Cache-Control"
    );
    next();
  });
  return fastify;
};

const start = () => {
  const fastify = create();
  core.start(fastify);
};

async function docs() {
  const fastify = create();
  await fastify.ready();

  if (fs.generateDocs) {
    await fs.generateDocs(fastify);
    process.exit(0);
  } else {
    fastify.log.warn(
      `Cannot generate docs, NODE_ENV is: ${process.env.NODE_ENV}`
    );
    process.exit(1);
  }
}

const options = {
  start,
  docs
};

try {
  if (!process.argv[1].includes("jest")) {
    process.argv[2] ? options[process.argv[2]]() : start();
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(
    err,
    `Invalid arg '${process.argv[2]}'. Please supply: 'start' OR 'docs'`
  );
}

module.exports = {
  create
};
