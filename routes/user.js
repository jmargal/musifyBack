const express = require("express");
const UserController = require("../controllers/user");
const api = express.Router();
const auth = require("../middlewares/authenticated");
const multipart=require('connect-multiparty')
const md_upload=multipart({uploadDir:'./uploads/users'})

api.get("/user/:id", auth.ensureAuth, UserController.getUser);
api.get("/user/image/:imageFile",UserController.getImage)
api.post("/user", UserController.saveUser);
api.post("/login", UserController.loginUser);
api.post("/user/image/:id",[auth.ensureAuth,md_upload],UserController.uploadImage)
api.put("/user/:id", auth.ensureAuth, UserController.updateUser);
api.delete("/user/:id", auth.ensureAuth, UserController.deleteUser);

module.exports = api;
