const utils = require("util");

const parseError = err =>
  utils.inspect(err, { breakLength: Infinity, depth: null });

module.exports = {
  parseError
};
