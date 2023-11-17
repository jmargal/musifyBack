const express = require("express");
const SongController = require("../controllers/song");
const auth = require("../middlewares/authenticated");
const validId = require("../middlewares/isValidId");
const multipart=require('connect-multiparty')
//Con esto es con lo que se sube la foto
const md_upload=multipart({uploadDir:'./uploads/songs'})
const api = express.Router();

api.get("/songs/:album?", SongController.getSongs);
api.get("/song/:id", SongController.getSong);
api.get("/song/file/:file",SongController.getFile)
api.get("/songs/album/:id",SongController.getSongsOfAlbum)
api.post("/song", SongController.saveSong);
api.post("/song/file/:id",[md_upload],SongController.uploadFile)
api.put("/song/:id", SongController.updateSong);
api.delete("/song/:id", SongController.deleteSong);
module.exports = api;
