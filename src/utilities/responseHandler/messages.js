const Handlebars = require("handlebars");

const Messages = {
  INVALID_ENTITY_ID: {
    en: "Invalid entity {{entity_id}}",
    es: "EntityIs {{sellerId}} no válido"
  },
  INVALID_FACILITY_INFO: {
    en:
      "Invalid sellerId {{sellerId}} or facilityId {{facilityId}} for tenant {{tenantId}}",
    es:
      "Vendedor {{sellerId}} o instalación {{installationId}} no válida para el inquilino {{tenantId}}"
  }
};

exports.parseMessage = (message, variable) => {
  const compiledMsg = {};
  Object.keys(Messages[message]).map(lang => {
    const template = Handlebars.compile(Messages[message][lang]);
    compiledMsg[lang] = template(variable);
  });
  return compiledMsg;
};
