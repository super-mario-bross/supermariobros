const { UNAUTHORIZED } = require("http-status-codes");

const authenticateFactory = fastify => {
  const { ApiError } = fastify.coreErrors;
  return async request => {
    const authInfo = request.headers.auth_info;
    if (!authInfo.is_authorized) {
      const error = { status: UNAUTHORIZED, detail: authInfo.error };
      throw new ApiError(error);
    }
    return;
  };
};

module.exports = authenticateFactory;
