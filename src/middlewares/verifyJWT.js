const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["cookie"];
  if (!authHeader) {
    console.log(req.headers);
    // console.log("authHeader",authHeader);
    return res.sendStatus(401);
  }

  const token = authHeader.split("jwt=")[1];
  console.log("Token",token); // Bearer token
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.sendStatus(401);
    }
    if (
      req.params.userId == decoded.id ||
      decoded.role == "admin" ||
      decoded.role == "seller"
    ) {
      next();
    }else{
      res.sendStatus(401);
    }
  });
};

module.exports = verifyJWT ;
