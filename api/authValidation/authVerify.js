const jwt = require("jsonwebtoken")

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      console.log("Verifying the accessToken ")
      const token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json(err +" " + user + "Token is not valid!");
        }
        
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You are not authenticated!");
    }
};

module.exports = {verify}
