const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SongChema = Schema({
  number: Number,
  name: String,
  duration: String,
  file: String,
  album: { type: Schema.ObjectId, ref: "Album" },
});

module.exports = mongoose.model("Song", SongChema);
