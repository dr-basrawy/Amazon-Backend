const jwt = require("jsonwebtoken");
var { promisify } = require("util");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

async function loginAuth(req, res, next) {
  var token = req.headers.authorization;
  console.log(token)
    if (!token) {
    return res.status(401).json({ message: 'You are not authorized, please login first' });
  }

  try {
    var decoded =await promisify(jwt.verify) (token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded);
    if (
      req.params.userId == decoded.id ||
      decoded.role == "admin" ||
      decoded.role == "seller"
    ) {
      next();
    } else {
      res
        .status(401)
        .json({ message: "Invalid token, You are not authorized" });
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid token, You are not authorized" });
  }
}

module.exports = loginAuth;
