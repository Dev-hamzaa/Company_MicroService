const dotenv = require("dotenv");
const jsonwebtoken = require("jsonwebtoken");
dotenv.config();

const verification = (req, res, next) => {
  const token = req.header("Authorization");
  // console.log('Token',token);
  if (!token) {
    return res.status(401).send("No token provided");
  }
  try {
    const verified = jsonwebtoken.verify(token, process.env.SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.log("Error:",error)
    res.status(401).send("Invalid token");
  }
};

const roleCheck = (requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (requiredRoles.includes(userRole.toLowerCase())) {
      next();
    } else {
      return res.status(403).send("Access Denied");
    }
  };
};

module.exports = { verification, roleCheck };
