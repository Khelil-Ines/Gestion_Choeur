const mongoose = require("mongoose");

const candidatSchema = mongoose.Schema({
  nom:{type :String, required:true},
  prenom:{type :String, required:true},
  email:{type :String, required:true, unique: true},
  pupitre: {
    type: String,
    enum: ['Soprano', 'Alto', 'Tenor','Basse'],
  },
  confirmation: { type: Boolean, default: false },


});
module.exports = mongoose.model("Candidat", candidatSchema);