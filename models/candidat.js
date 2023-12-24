const mongoose = require("mongoose");
const moment = require('moment');
const utilisateur = require("./utilisateur")

const candidatSchema = mongoose.Schema({
  connaissance__musicale : {type:String , require:true},
  autres_activites  : {type:Boolean , require:false},
  Taille :{type:Number, require: false},
  confirmation: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => moment().toDate() },

});
module.exports = utilisateur.discriminator("Candidat", candidatSchema)