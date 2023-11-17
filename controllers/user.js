const User = require('../models/user');
const bcrypt = require('bcrypt-node');
const jwt = require('../services/jwt');
const fs= require('fs');
const path = require('path');

async function getUser(req, res) {
    try{
        const id=req.params.id;
        const user = await User.findById(id);
        if(user){
            res.status(200).send({user: user});
        }else{
            res.status(404).send({ message: 'User does not exists' });

        }
    }catch(err){
        console.error(err);
        res.status(500).send({ message: 'Error in the request' });
    }
}

function saveUser(req, res) {
    const params = req.body;
    let user=asignDataUser(req)
    if (params.password) {
        bcrypt.hash(params.password, null, null, function(err, hash) {
            if (err) {
                res.status(500).send({ message: 'Error al guardar el usuario',error: err });
            } else {
                user.password = hash;
                if (user.name != null && user.surname != null && user.email != null) {
                    user.save(user);
                    res.status(200).send({ user: user });
                } else {
                    res.status(200).send({ message: 'Introduce todos los campos' });
                }
            }
        });
    } else {
        res.status(500).send({ message: 'Introduce contraseña' });
    }
}

function asignDataUser(data) {
    let user = new User();
    const params = data.body;
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = null;
    return user;
}

async function loginUser(req, res) {
    const params = req.body;
    const email = params.email;
    const user=await User.findOne({email})
    if(!user){
        res.status(404).send({message:'User not found'});
    }else{
        verifyPassword(params,user.password,res);
    }
}

async function verifyPassword(params, userPass, res) {
    const email = params.email;
    try {
    //Compare espera las dos cosas a comparar y un callback
    bcrypt.compare(params.password, userPass,async (err,resolve)=>{
        if (err) {
            console.error('Error while verifying password:', err);
            res.status(500).send({ message: 'Internal server error' });
            return;
        }
        if (resolve) {
            const user = await User.findOne({ email });
            if (params.gethash) {
                res.status(200).send({ token:jwt.createToken(user)})
            } else {
            res.status(200).send({ user });
            }
        } else {
            res.status(404).send({ message: 'Incorrect password' });
        }});
    } 
    catch (error) {
      console.error('Error while verifying password:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }

async function updateUser(req, res) {
    try{
        const id=req.params.id;
        const body=req.body;
        if(id!=req.user.sub){
          return res.status(403).send({error: 'Unauthorized'});

        }
        const updated=await User.findByIdAndUpdate(id, body,{new:true});
        if(updated){
            res.status(200).send({user: updated});
        }else{
            res.status(500).send({message: 'User not found'});
        }
    }catch(error) {
        console.error(error);
        res.status(500).send({error: error});
    }
}

async function deleteUser(req, res) {
    try{
        const id=req.params.id;
        const deleted=await User.findByIdAndDelete(id);
        res.status(200).send({deleted: deleted});
    }catch(error) {
        console.error(error);
        res.status(500).send({error: error});
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
            const updated=await User.findByIdAndUpdate(id, {image:fileName},{new:true});
            res.status(200).send({user:updated, image:fileName});
        }else{
            res.status(400).send({message:'Extension not allowed'});
        }

    }else{
        res.status(500).send({message:'Image not uploaded'});
    }
}

function getImage(req, res) {
    const imageFile = req.params.imageFile;
    const imagePath = path.join(__dirname, '../uploads/users', imageFile);
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.status(404).send({ message: 'Image not found' });
      } else {
        res.sendFile(imagePath);
      }
    });
  }

module.exports = { saveUser,loginUser,getUser,updateUser,deleteUser,uploadImage,getImage };