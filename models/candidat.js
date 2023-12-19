const mongoose = require("mongoose");
const utilisateur = require("./utilisateur");

const CandidatSchema = mongoose.Schema({
  connaissance_musicale: { type: String, required: true },
  autres_activites: { type: Boolean, required: true },
  Taille: { type: Number, required: true },
  confirmation: { type: Boolean}
});

module.exports = utilisateur.discriminator("Candidat", CandidatSchema);