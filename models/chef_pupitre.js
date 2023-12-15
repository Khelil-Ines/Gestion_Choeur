const mongoose = require('mongoose');
const choriste = require('./choriste.js');

const chef_pupitreSchema = new mongoose.Schema({
  

});

const chef_pupitre = choriste.discriminator('Chef_Pupitre', chef_pupitreSchema);

module.exports = chef_pupitre;
