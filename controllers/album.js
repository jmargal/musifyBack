const path = require("path");
const fs = require("fs");
const Album = require("../models/album");
const Song = require("../models/song");

async function getAlbum(req, res) {
  try {
    const id = req.params.id;
    const album = await Album.findById(id).populate("artist");
    if (album) {
      res.status(200).send(album);
    } else {
      res.status(404).send({ message: "Album not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Error" });
  }
}

async function getAlbums(req, res) {
  try {
    let albums;
    if (!req.params.artist) {
      albums = await Album.find().sort("title").populate("artist");
    } else {
      albums = await Album.find({ artist: req.params.artist }).sort("year").populate("artist");
    }
    res.status(200).send({ albums: albums });
  } catch (error) {
    res.status(500).send({ message: "Error" });
  }
}

async function saveAlbum(req, res) {
  try {
    const album = asignDataAlbum(req);
    album.save(album);
    res.status(200).send({ album: album });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function updateAlbum(req, res) {
  try{
    const id=req.params.id;
    const body=req.body;
    const updated=await Album.findByIdAndUpdate(id, body,{ new: true });
    if(updated){
      res.status(200).send({ album: updated });
    }else{
      res.status(404).send({ message:"Album not found"});
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
}

async function deleteAlbum(req, res){
  try {
    const id=req.params.id;
    //Borrado de las canciones de ese album
    const songs=await Song.find({});
    let songsIds=[];
    if(songs){
      for(const s of songs){
        //Como no se puede comparar el objeto obtengo la cadena del id
        if((s.album.valueOf())==id){
          songsIds.push(s._id.valueOf()); 
        }
      }
    }
    await Song.deleteMany({_id:{ $in: songsIds }})

    const deletedAlbum = await Album.findByIdAndDelete(id);
    if (!deletedAlbum) {
      return res.status(404).send({ message: "Album not found" });
    }
    res.status(200).send({deletedAlbum: deletedAlbum});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
}

async function uploadImage(req,res){
  const id=req.params.id;
  if(req.files){
      //Se separa el nombre del archivo
      const path=req.files.image.path;
      const fileSplit=path.split('\\');
      const fileName=fileSplit[2]

      //Se verifica que es una extension valida
      const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif','webp'];
      const extSplit=fileName.split('\.');
      const extension=extSplit[1];
      if(allowedExtensions.includes(extension)){
          const updated=await Album.findByIdAndUpdate(id, {image:fileName},{new:true});
          res.status(200).send({album:updated});
      }else{
          res.status(400).send({message:'Extension not allowed'});
      }
  }else{
      res.status(500).send({message:'Image not uploaded'});
  }
}

function getImage(req, res) {
  const imageFile = req.params.imageFile;
  const imagePath = path.join(__dirname, '../uploads/albums', imageFile);
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send({ message: 'Image not found' });
    } else {
      res.sendFile(imagePath);
    }
  });
}

function asignDataAlbum(data) {
  let album = new Album();
  const params = data.body;
  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = params.image;
  album.artist = params.artist;
  return album;
}

module.exports = { getAlbums, getAlbum, saveAlbum,updateAlbum,deleteAlbum,uploadImage,getImage };
