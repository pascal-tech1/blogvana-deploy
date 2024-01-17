const jwt = require("jsonwebtoken");

const generateJwtToken = (id) => {
  const jwtToken = jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "10d" });
  return jwtToken;
};

module.exports = generateJwtToken;


