const mongoose = require("mongoose");

const candidatSchema = mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  connaissance_musicale: { type: String, required: true },
  autres_activites: { type: Boolean, required: true },
  Taille: { type: Number, required: true },
  confirmation: { type: Boolean },
});
module.exports = mongoose.model("Candidat", candidatSchema);
