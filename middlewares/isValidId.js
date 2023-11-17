const mongoose = require("mongoose");

// Función de middleware para comprobar el ID
function isValidMongoId(req, res, next) {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    // Si el ID no es válido, responde con un error 400 (Bad Request)
    return res.status(400).json({ error: "Invalid MongoId" });
  }
  next();
}

function isValidArtist(req, res, next) {
  const id = req.params.artist;
  if (id) {
    if (!mongoose.isValidObjectId(id)) {
      // Si el ID no es válido, responde con un error 400 (Bad Request)
      return res.status(400).json({ error: "Invalid MongoId" });
    }
  }
  next();
}

module.exports = { isValidMongoId, isValidArtist };
