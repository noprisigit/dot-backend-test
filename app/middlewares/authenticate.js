const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  jwt.verify(
    req.headers["x-access-token"],
    process.env.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized Access",
        });
      } else {
        req.body.userId = decoded.id;
        next();
      }
    }
  )
}