const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//CORS configuration
const {allowCors} = require("./middlewares/cors");
app.use(allowCors);

//Rutas
const user_routes = require("./routes/user");
const artist_routes = require("./routes/artist");
const album_routes = require("./routes/album");
const song_routes = require("./routes/song");


//Config json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Rutas base
app.use("/api", user_routes); //Con esto a todas las peticiones de ese controller se les pondrá el /api delante
app.use("/api", artist_routes); 
app.use("/api",album_routes);
app.use("/api",song_routes);
module.exports = app;
