const path = require("path");
const fs = require("fs");
const Song = require("../models/song");

async function getSongs(req, res) {
  try {
    let songs;
    if (!req.params.album) {
      songs = await Song.find().sort("number");
    } else {
      songs = await Song.find({ album: req.params.album }).sort("number");
    }
    res.status(200).send({ songs: songs });
  } catch (error) {}
}

async function getSong(req, res) {
  try {
    const id = req.params.id;
    const song = await Song.findById(id);
    if (song) {
      res.status(200).send({ song: song });
    } else {
      res.status(400).send({ message: "Song not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error" });
  }
}

async function getSongsOfAlbum(req, res) {
  try {
    const id = req.params.id;
    const songs = await Song.find({ album: id }).sort("number");
    if (songs) {
      res.status(200).send({ songs });
    } else {
      res.status(400).send({ message: "Song not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error" });
  }
}

async function saveSong(req, res) {
  try {
    const song = asignDataSong(req);
    song.save(song);
    res.status(200).send({ song: song });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error });
  }
}

async function updateSong(req, res) {
  try {
    const id = req.params.id;
    const body = req.body;
    const updated = await Song.findByIdAndUpdate(id, body, { new: true });
    if (updated) {
      res.status(200).send({ song: updated });
    } else {
      res.status(404).send({ message: "Album not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error });
  }
}

async function deleteSong(req, res) {
  try {
    const id = req.params.id;
    const deleted = await Song.findByIdAndDelete(id);
    if (deleted) {
      res.status(200).send({ song: deleted });
    } else {
      res.status(404).send({ message: "Song not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error });
  }
}

async function uploadFile(req, res) {
  const id = req.params.id;
  if (req.files) {
    //Se separa el nombre del archivo
    const path = req.files.file.path;
    const fileSplit = path.split("\\");
    const fileName = fileSplit[2];

    //Se verifica que es una extension valida
    const allowedExtensions = ["mp3", "ogg"];
    const extSplit = fileName.split(".");
    const extension = extSplit[1];
    if (allowedExtensions.includes(extension)) {
      const updated = await Song.findByIdAndUpdate(
        id,
        { file: fileName },
        { new: true }
      );
      res.status(200).send({ song: updated });
    } else {
      res.status(400).send({ message: "Extension not allowed" });
    }
  } else {
    res.status(500).send({ message: "File not uploaded" });
  }
}

function getFile(req, res) {
  const file = req.params.file;
  const filePath = path.join(__dirname, "../uploads/songs", file);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send({ message: "File not found" });
    } else {
      res.sendFile(filePath);
    }
  });
}

function asignDataSong(data) {
  let song = new Song();
  const params = data.body;
  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.file = params.file;
  song.album = params.album;
  return song;
}

module.exports = {
  getSongs,
  getSong,
  getSongsOfAlbum,
  saveSong,
  updateSong,
  deleteSong,
  uploadFile,
  getFile,
};
