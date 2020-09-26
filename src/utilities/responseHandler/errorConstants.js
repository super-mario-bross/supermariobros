const catalogConstants = {
  MEDIA_REF_TYPE_PRODUCT: "SELLER",
  PSQL_RESTRICT_VIOLATION_ERROR_CODE: "23001",
  CARDINALITY_VIOLATION: "21000",
  PSQL_DUPLICATE_KEY_VIOLATION_ERROR_CODE: "23505",
  PSQL_FOREIGN_KEY_VIOLATION_ERROR_CODE: "23503",
  ENTITY_TYPE_NOT_FOUND: "ENTITY_TYPE_NOT_FOUND",
  SUCCESS: "success",
  FAILED: "failed",
  IN_PROGRESS: "in_progress",
  NOT_AVAILABLE: "NA",

  //GENERIC DB ERRORS
  OLD_DATA_ERROR: {
    name: "OLD_DATA_ERROR",
    title: "Trying to update with old data, try with newer date",
    titleES: "Actualizacion es antiguo/invalido, intente con nueva fecha"
  },
  SCHEMA_ERROR: {
    name: "SCHEMA_ERROR",
    title: "The request data violates the schema constraints",
    titleES: "Data es invalido, no cumple con esquema requerido"
  },
  FK_VIOLATION: {
    name: "FK_VIOLATION",
    title: `Foreign Key constraint violation`,
    titleES: `Infraccion de restriccion de clave externa`
  },
  DUPLICATE_KEY_VIOLATION: {
    name: "DUPLICATE_KEY_VIOLATION",
    title: `Duplicate Key constraint violation`,
    titleES: `Infraccion de restriccion de clave duplicada`
  },
  CXT_TIMEOUT: {
    name: "Connection timeout",
    title: `Connection terminated due to timeout.`,
    titleES: `Conexion terminada debido al tiempo de espera.`
  },
  GENERIC_SERVER_ERROR: {
    name: "GENERIC_SERVER_ERROR",
    title: `The Server encountered an internal error or misconfiguration and was unable to complete the request.`,
    titleES: `El servidor encontro un error interno o una configuracion incorrecta y no pudo completar la solicitud.`
  }
};

module.exports = catalogConstants;
