const jwt = require('jsonwebtoken');
var {promisify} = require('util')
const dotenv = require("dotenv")
dotenv.config({ path: "config.env" })

async function sellerAuth (req, res, next){

  

  try {
    var decoded =await promisify(jwt.verify) (req.headers.authorization, process.env.JWT_SECRET);

    // if (req.params.userId == decoded.userID) {
        if (decoded.role=='seller') {
            next();
    }
    else{
      res.status(401).json({ message: 'you are not seller' });

    }
    
  } catch (err) {
    res.status(401).json({ message: 'catch you are not seller' });
  }
};

 

module.exports = sellerAuth;