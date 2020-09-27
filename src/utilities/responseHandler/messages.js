const Handlebars = require("handlebars");

const Messages = {
  INVALID_ENTITY_ID: {
    en: "Invalid entity {{entity_id}}",
    es: "EntityIs {{entity_id}} no válido"
  },
  INVALID_REVIEW_ID: {
    en: "Invalid review id {{review_id}}",
    es: "ReviewIds {{review_id}} no válido"
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
