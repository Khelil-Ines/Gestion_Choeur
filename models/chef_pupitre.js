const mongoose = require('mongoose');

const chef_pupitreSchema = new mongoose.Schema({
  

});

const chef_pupitre = mongoose.model('chef_pupitre', chef_pupitreSchema);

module.exports = chef_pupitre;
