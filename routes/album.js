const express = require("express");
const AlbumController = require("../controllers/album");
const auth = require("../middlewares/authenticated");
const validId=require("../middlewares/isValidId")
const multipart=require('connect-multiparty')
//Con esto es con lo que se sube la foto
const md_upload=multipart({uploadDir:'./uploads/albums'})
const api = express.Router();

api.get("/albums/:artist?",[validId.isValidArtist],AlbumController.getAlbums);
api.get("/album/:id",[validId.isValidMongoId],AlbumController.getAlbum);
api.get("/album/image/:imageFile",AlbumController.getImage)
api.post("/album",AlbumController.saveAlbum);
api.post("/album/image/:id",[auth.ensureAuth,md_upload],AlbumController.uploadImage)
api.put("/album/:id",AlbumController.updateAlbum);
api.delete("/album/:id",AlbumController.deleteAlbum);

module.exports=api;