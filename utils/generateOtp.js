
const randomstring = require("randomstring");
function generateOtp() {
  return randomstring.generate({
    length: 5,
    charset: "numeric",
  });
}

module.exports = {
  generateOtp,
};
