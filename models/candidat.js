const mongoose = require("mongoose");

const candidatSchema = mongoose.Schema({
  nom:{type :String, required:true},
  prenom:{type :String, required:true},
  email:{type :String, required:true, unique: true},
  confirmation: { type: Boolean, default: false },

});
module.exports = mongoose.model("Candidat", candidatSchema);