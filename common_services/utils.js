
exports.generateRandomNumber = function (numberOfDigits) {
    let text = "";
    let possible = "0123456789";
    for (let i = 0; i < numberOfDigits; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

exports.generateRandomStringAndNumbers = function () {
    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };
