const mongoose = require("mongoose");

const candidatSchema = mongoose.Schema({
  nom:{type :String, required:true},
  prenom:{type :String, required:true},
  email:{type :String, required:true, unique: true},
  pupitre: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Pupitre'
  },
  confirmation: { type: Boolean, default: false },
  compte: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Compte', 
    required: true 
  },

});
module.exports = mongoose.model("Candidat", candidatSchema);