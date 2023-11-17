function allowCors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-Key,X-Requested-With,Content-Type,Accept,Access-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Allow", "*");
  next();
}
module.exports = {allowCors}