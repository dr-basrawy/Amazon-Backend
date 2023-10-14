const jwt = require('jsonwebtoken');
var {promisify} = require('util')
const dotenv = require("dotenv")
dotenv.config({ path: "config.env" })

async function adminOrSellerAuth (req, res, next){

  

  try {
    var decoded =await promisify(jwt.verify) (req.headers.authorization, process.env.JWT_SECRET);

    // if (req.params.userId == decoded.userID) {
        console.log(decoded.role);
        if (decoded.role=='admin' || decoded.role=='seller') {
            next();
    }
    else{
      res.status(401).json({ message: 'you are not admin or seller ' });

    }
    
  } catch (err) {
    res.status(401).json({ message: 'catch you are not admin or seller' });
  }
};

 

module.exports = adminOrSellerAuth;