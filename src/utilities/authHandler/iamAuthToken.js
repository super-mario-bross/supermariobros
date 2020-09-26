const { google, iamcredentials_v1 } = require("googleapis");
const fp = require("fastify-plugin");

const {
  GOOGLE_APPLICATION_CREDENTIALS,
  GCP_AUTH_SCOPE,
  SCHEDULER_SERVICE_ACCOUNT_EMAIL,
  SCHEDULER_AUDIENCE
} = process.env;

const iamAuth = fp(async (fastify, options, next) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: GOOGLE_APPLICATION_CREDENTIALS,
    scopes: GCP_AUTH_SCOPE
  });
  const iamcredentials = new iamcredentials_v1.Iamcredentials();
  const fetch = async logTrace => {
    try {
      fastify.log.info({
        logTrace,
        message: "Invoking request to fetch IAM token for the service account"
      });
      const params = {
        auth,
        name: `projects/-/serviceAccounts/${SCHEDULER_SERVICE_ACCOUNT_EMAIL}`,
        requestBody: {
          audience: SCHEDULER_AUDIENCE
        }
      };
      const response = await iamcredentials.projects.serviceAccounts.generateIdToken(
        params
      );
      return response.data.token;
    } catch (err) {
      fastify.log.error({
        logTrace,
        err,
        message: "Error while fetching the IAM Auth Token"
      });
      throw err;
    }
  };
  fastify.decorate("iamAuthToken", { fetch });
  next();
});

module.exports = iamAuth;
