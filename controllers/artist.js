const path = require("path");
const fs = require("fs");
const Artist = require("../models/artist");
const Album = require("../models/album");
const Song = require("../models/song");

async function getArtist(req, res) {
  try {
    const id = req.params.id;
    const artist = await Artist.findById(id);
    if (artist) {
      res.status(200).send({ artist: artist });
    } else {
      res.status(500).send({ message: "Artist not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error in the request" });
  }
}

async function getArtistByName(req, res) {
  try{
    const name = req.params.name;
    const artist = await Artist.findOne({ name });
    if (artist) {
      res.status(200).send({ artist: artist });
    } else {
      res.status(500).send({ message: "Artist not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error in the request" });
  }
}

async function getArtists(req, res) {
  try {
    let nPage = 1;
    let numArtist = 4;
    //El número de la página que se pide, por defecto 1
    if (req.params.nPage) {
      nPage = parseInt(req.params.nPage);
    }
    //El número de artistas por página, por defecto 4
    if (req.params.numArtist) {
      numArtist = parseInt(req.params.numArtist);
    }
    //El salto de páginas, se calcula el numero de documentos que debe saltar
    const skip = (nPage - 1) * numArtist;
    const artistList = await Artist.find().sort("name").skip(skip).limit(numArtist);
    res.status(200).send({ page: nPage, numArtist: numArtist, artists: artistList });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
}

async function saveArtist(req, res) {
  try {
    const artist = asignDataArtist(req);
    artist.save(artist);
    res.status(200).send({ artist: artist });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function updatedArtist(req, res) {
  try {
    const id = req.params.id;
    const body = req.body;
    const updated = await Artist.findByIdAndUpdate(id, body, { new: true });
    if (updated) {
      res.status(200).send({ updated: updated });
    } else {
      res.status(500).send({ message: "Artist not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function deleteArtist(req, res) {
  try {
    const id=req.params.id;
    //Buscar todos los álbumes asociados al artista y guardar sus ids en un array
    const totalAlbums = await Album.find({});
    let albumsIds=[];
    if(totalAlbums){
      for(const alb of totalAlbums) {
        //Como no se puede comparar el objeto obtengo la cadena del id
        if(alb.artist.valueOf() === id){
          albumsIds.push(alb._id.valueOf());
        }
      }
    }
   
    //Canciones que pertenecen a los albums que se van a borrar
    const songs=await Song.find({});
    let songsIds=[];
    if(songs){
      for(const s of songs){
        //Como no se puede comparar el objeto obtengo la cadena del id
        if(albumsIds.includes(s.album.valueOf()) ){
          songsIds.push(s._id.valueOf()); 
        }
      }
    }
    //Borra los ids que estén en los array que he hecho antes con los ids de los objetos a borrar
    await Album.deleteMany({_id:{ $in: albumsIds }})
    await Song.deleteMany({_id:{ $in: songsIds }})

    const deletedArtist = await Artist.findByIdAndDelete(id);
    if (!deletedArtist) {
      return res.status(404).send({ message: "Artista no encontrado" });
    }
    res.status(200).send({deleteArtist: deletedArtist});
  
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
          const updated=await Artist.findByIdAndUpdate(id, {image:fileName},{new:true});
          res.status(200).send({artist:updated});
      }else{
          res.status(400).send({message:'Extension not allowed'});
      }

  }else{
      res.status(500).send({message:'Image not uploaded'});
  }
}

function getImage(req, res) {
  const imageFile = req.params.imageFile;
  const imagePath = path.join(__dirname, '../uploads/artists', imageFile);
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send({ message: 'Image not found' });
    } else {
      res.sendFile(imagePath);
    }
  });
}

function asignDataArtist(data) {
  let artist = new Artist();
  const params = data.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = params.image;
  return artist;
}

module.exports = { getArtist, getArtistByName, getArtists, saveArtist, updatedArtist,deleteArtist,uploadImage,getImage };
