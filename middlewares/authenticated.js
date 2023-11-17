const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "clave_secreta_curso";

exports.ensureAuth = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "There is not authorization in the request" });
  }
  const token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    const payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: "Token has expired" });
    }else{
      req.user = payload;
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Not valid token" });
  }
};
