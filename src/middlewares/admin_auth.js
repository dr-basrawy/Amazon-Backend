const jwt = require('jsonwebtoken');
var {promisify} = require('util')
const dotenv = require("dotenv")
dotenv.config({ path: "config.env" })

async function adminAuth (req, res, next){

  

  try {
    var decoded =await promisify(jwt.verify) (req.headers.authorization, process.env.JWT_SECRET);

    // if (req.params.userId == decoded.userID) {
        if (decoded.role=='admin') {
            next();
    }
    else{
      res.status(401).json({ message: 'you are not admin' });

    }
    
  } catch (err) {
    res.status(401).json({ message: 'catch you are not admin' });
  }
};

 

module.exports = adminAuth;