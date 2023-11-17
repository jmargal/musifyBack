const express = require("express");
const ArtistController = require("../controllers/artist");
const auth = require("../middlewares/authenticated");
const validId=require("../middlewares/isValidId")
const multipart=require('connect-multiparty')
const md_upload=multipart({uploadDir:'./uploads/artists'})
const api = express.Router();

api.get("/artist/:id",[validId.isValidMongoId,auth.ensureAuth],ArtistController.getArtist);
api.get("/artist/name/:name",[auth.ensureAuth],ArtistController.getArtistByName);
api.get("/artists/:nPage?/:numArtist?",ArtistController.getArtists);
api.get("/artist/image/:imageFile",ArtistController.getImage)
api.post("/artist",auth.ensureAuth,ArtistController.saveArtist);
api.post("/artist/image/:id",[auth.ensureAuth,md_upload],ArtistController.uploadImage)
api.put("/artist/:id",[validId.isValidMongoId,auth.ensureAuth],ArtistController.updatedArtist);
api.delete("/artist/:id",[validId.isValidMongoId,auth.ensureAuth],ArtistController.deleteArtist);
module.exports=api;