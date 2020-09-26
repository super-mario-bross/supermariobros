const Handlebars = require("handlebars");

const Messages = {
  INVALID_SELLER_ID: {
    en: "Invalid sellerId {{sellerId}} for tenant {{tenantId}}",
    es: "SellerId {{sellerId}} no válido para el inquilino {{tenantId}}"
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
