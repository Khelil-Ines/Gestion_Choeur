const mongoose = require("mongoose");
const utilisateur = require("./utilisateur")

const candidatSchema = mongoose.Schema({
  connaissance__musicale : {type:String , require:true},
  autres_activites  : {type:Boolean , require:false},
  taille :{type:Number, require: false},
  confirmation: { type: Boolean, default: false },

});
module.exports = utilisateur.discriminator("Candidat", candidatSchema)