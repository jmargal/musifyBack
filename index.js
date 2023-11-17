const mongoose=require('mongoose');
const app = require('./app');
const port=3977;

mongoose.connect("mongodb://localhost:27017/curso_mean") .then(() => {
    console.log('Connected to MongoDB successfully!');
    app.listen(port, function(){
      console.log("Listening on port " + port)
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });






