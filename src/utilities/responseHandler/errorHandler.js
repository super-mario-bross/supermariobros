const {
  getStatusText,
  CONFLICT,
  BAD_REQUEST,
  PRECONDITION_FAILED,
  INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE
} = require("http-status-codes");
const {
  PSQL_RESTRICT_VIOLATION_ERROR_CODE,
  CARDINALITY_VIOLATION,
  PSQL_DUPLICATE_KEY_VIOLATION_ERROR_CODE,
  PSQL_FOREIGN_KEY_VIOLATION_ERROR_CODE,
  OLD_DATA_ERROR,
  SCHEMA_ERROR,
  FK_VIOLATION,
  DUPLICATE_KEY_VIOLATION,
  CXT_TIMEOUT,
  GENERIC_SERVER_ERROR
} = require("./errorConstants");

const { parseMessage } = require("./messages");

const errorHandlerFactory = fastify => {
  const { ApiError } = fastify.coreErrors;

  const getError = (info, status, detail, code, meta) => {
    return new ApiError({
      code: code,
      status,
      title: info && {
        en: info.title,
        es: info.titleES
      },
      detail,
      meta
    });
  };

  const dbError = error => {
    let status;
    let detail;
    let code;
    let info;
    if (error.code === PSQL_RESTRICT_VIOLATION_ERROR_CODE) {
      status = CONFLICT;
      code = getStatusText(CONFLICT);
      info = OLD_DATA_ERROR;
      detail = `${error.detail}. Please try again with the updated data`;
    } else if (error.code === CARDINALITY_VIOLATION) {
      status = BAD_REQUEST;
      code = getStatusText(BAD_REQUEST);
      info = SCHEMA_ERROR;
      detail =
        error.hint ||
        "Same data is repeating. Please try again after removing the duplicate data";
    } else if (error.code === PSQL_DUPLICATE_KEY_VIOLATION_ERROR_CODE) {
      status = CONFLICT;
      code = getStatusText(CONFLICT);
      info = DUPLICATE_KEY_VIOLATION;
      detail = error.detail;
    } else if (error.code === PSQL_FOREIGN_KEY_VIOLATION_ERROR_CODE) {
      status = PRECONDITION_FAILED;
      code = getStatusText(PRECONDITION_FAILED);
      info = FK_VIOLATION;
      detail = error.detail;
    } else if (
      error.message === "Connection terminated due to connection timeout" ||
      error.message === "timeout exceeded when trying to connect"
    ) {
      status = SERVICE_UNAVAILABLE;
      code = getStatusText(SERVICE_UNAVAILABLE);
      info = CXT_TIMEOUT;
      detail = "DB connection timeout";
    } else {
      status = INTERNAL_SERVER_ERROR;
      code = getStatusText(INTERNAL_SERVER_ERROR);
      info = GENERIC_SERVER_ERROR;
      detail = error.detail || error.message;
    }
    return getError(info, status, detail, code);
  };
  const serviceErrorHandler = (status, message, variables = {}) => {
    const errorInfo = {
      status,
      title: parseMessage(message, variables),
      code: getStatusText(status)
    };
    console.log("--------", errorInfo);
    throw new ApiError(errorInfo);
  };

  return {
    dbError,
    serviceErrorHandler
  };
};

module.exports = errorHandlerFactory;
