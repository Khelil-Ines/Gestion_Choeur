const mongoose = require("mongoose");

const candidatSchema = mongoose.Schema({
  nom:{type :String, required:true},
  prenom:{type :String, required:true}

});
module.exports = mongoose.model("Candidat", candidatSchema);
